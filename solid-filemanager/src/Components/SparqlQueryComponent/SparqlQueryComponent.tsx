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
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1 style={{ textAlign: "center", color: "#2c3e50" }}>SPARQL Query Interface</h1>

            <div style={{ marginBottom: "20px" }}>
                <label htmlFor="sparqlQuery" style={{ fontSize: "16px", fontWeight: "bold", color: "#34495e" }}>
                    Enter your SPARQL query:
                </label>
                <textarea
                    id="sparqlQuery"
                    value={sparqlQuery}
                    onChange={(e) => setSparqlQuery(e.target.value)}
                    placeholder="Enter your SPARQL query here"
                    rows={8}
                    style={{
                        width: "100%",
                        padding: "10px",
                        fontSize: "14px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        boxSizing: "border-box",
                        fontFamily: "Courier, monospace",
                        backgroundColor: "#f4f4f4",
                    }}
                />
            </div>

            <div style={{textAlign: "center", marginBottom: "20px"}}>
                <button
                    onClick={executeQuery}
                    style={{
                        padding: "10px 20px",
                        fontSize: "16px",
                        backgroundColor: "#3498db",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        transition: "background-color 0.3s",
                    }}
                    onMouseOver={(e) => {
                        (e.target as HTMLButtonElement).style.backgroundColor = "#2980b9";
                    }}
                    onMouseOut={(e) => {
                        (e.target as HTMLButtonElement).style.backgroundColor = "#3498db";
                    }}
                >
                    Run Query
                </button>

            </div>

            {error && (
                <p style={{
                    color: "red",
                    textAlign: "center",
                    fontSize: "16px",
                    fontWeight: "bold",
                    marginTop: "10px",
                }}>
                    Error: {error}
                </p>
            )}

            {results.length > 0 && (
                <div style={{marginTop: "20px", backgroundColor: "#ecf0f1", padding: "20px", borderRadius: "4px"}}>
                    <h2 style={{color: "#2c3e50" }}>Results</h2>
                    <pre style={{
                        backgroundColor: "#ffffff",
                        padding: "10px",
                        fontFamily: "Courier, monospace",
                        borderRadius: "4px",
                        fontSize: "14px",
                        overflowX: "auto",
                        wordWrap: "break-word",
                    }}>
                        {JSON.stringify(results, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default SparqlQueryComponent;
