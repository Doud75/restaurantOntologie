import React, { useState } from "react";
import { QueryEngine } from "@comunica/query-sparql";

interface SparqlQueryComponentProps {
    files: string[];
}

const SparqlQueryComponent: React.FC<SparqlQueryComponentProps> = ({ files }) => {
    const [sparqlQuery, setSparqlQuery] = useState<string>("");
    const [results, setResults] = useState<Array<Record<string, any>>>([]);
    const [error, setError] = useState<string | null>(null);

    const executeQuery = async () => {
        try {
            setError(null);
            setResults([]);
            const queryEngine = new QueryEngine();

            const allResults: Array<Record<string, any>> = [];

            for (const file of files) {
                try {
                    const baseUrlSparql = 'http://localhost:3000/';
                    const url = `${baseUrlSparql}${file}`;

                    console.log(url);
                    //@ts-ignore
                    const resultStream = await queryEngine.queryBindings(sparqlQuery, {
                        sources: [url],
                        //@ts-ignore
                        fetch: (url: string) => fetch(url),
                    });

                    for await (const binding of resultStream) {
                        const result: Record<string, any> = {};
                        binding.forEach((value, key) => {
                            result[key.value] = value.value;
                        });

                        const uniqueKey = JSON.stringify(result);

                        if (!allResults.some(existingResult => JSON.stringify(existingResult) === uniqueKey)) {
                            allResults.push(result);
                        }
                    }
                } catch (fileError) {
                    console.error(`Erreur avec le fichier ${file}:`, fileError);
                }
            }


            const uniqueResults = Array.from(
                new Set(allResults.map((res) => JSON.stringify(res)))
            ).map((res) => JSON.parse(res));

            setResults(uniqueResults);
        //@ts-ignore
        } catch (err: any) {
            setError(err.message || "An error occurred.");
        }
    };

    return (
        <div>
            <h1>SPARQL Query Interface</h1>
            <textarea
                value={sparqlQuery}
                onChange={(e) => setSparqlQuery(e.target.value)}
                placeholder="Enter your SPARQL query here"
                rows={6}
                style={{ width: "100%" }}
            ></textarea>
            <button onClick={executeQuery}>Run Query</button>
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
            {results.length > 0 && (
                <div>
                    <h2>Results</h2>
                    <pre>{JSON.stringify(results, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default SparqlQueryComponent;
