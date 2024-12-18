import { object, string } from 'yup';
import { getLoggerFor } from '../../../logging/LogUtil';
import { BadRequestHttpError } from '../../../util/errors/BadRequestHttpError';
import type { EmptyObject } from '../../../util/map/MapUtil';
import type { JsonRepresentation } from '../InteractionUtil';
import type { JsonInteractionHandlerInput } from '../JsonInteractionHandler';
import { JsonInteractionHandler } from '../JsonInteractionHandler';
import type { JsonView } from '../JsonView';
import { parseSchema, validateWithError } from '../YupUtil';
import type { ForgotPasswordStore } from './util/ForgotPasswordStore';
import type { PasswordStore } from './util/PasswordStore';

const inSchema = object({
  recordId: string().trim().min(1).required(),
  password: string().trim().required(),
});

/**
 * Resets a password if a valid `recordId` is provided,
 * which should have been generated by a different handler.
 */
export class ResetPasswordHandler extends JsonInteractionHandler<EmptyObject> implements JsonView {
  protected readonly logger = getLoggerFor(this);

  private readonly passwordStore: PasswordStore;
  private readonly forgotPasswordStore: ForgotPasswordStore;

  public constructor(passwordStore: PasswordStore, forgotPasswordStore: ForgotPasswordStore) {
    super();
    this.passwordStore = passwordStore;
    this.forgotPasswordStore = forgotPasswordStore;
  }

  public async getView(): Promise<JsonRepresentation> {
    return { json: parseSchema(inSchema) };
  }

  public async handle({ json }: JsonInteractionHandlerInput): Promise<JsonRepresentation<EmptyObject>> {
    // Validate input data
    const { password, recordId } = await validateWithError(inSchema, json);

    await this.resetPassword(recordId, password);
    return { json: {}};
  }

  /**
   * Resets the password for the account associated with the given recordId.
   */
  private async resetPassword(recordId: string, newPassword: string): Promise<void> {
    const id = await this.forgotPasswordStore.get(recordId);

    if (!id) {
      this.logger.warn(`Trying to use invalid reset URL with record ID ${recordId}`);
      throw new BadRequestHttpError('This reset password link is no longer valid.');
    }

    await this.passwordStore.update(id, newPassword);
    await this.forgotPasswordStore.delete(recordId);

    this.logger.debug(`Resetting password for login ${id}`);
  }
}
