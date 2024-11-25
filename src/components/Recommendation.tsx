import { useEffect, useState } from "react";
import parse from "html-react-parser"; // Import the HTML parser

// Import Groq SDK correctly using ES6 import
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: "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",
    dangerouslyAllowBrowser: true,
});

const Recommendation = ({
    sales,
    total_sales,
    sales_count,
}: {
    sales: any[];
    total_sales: number;
    sales_count: number;
}) => {
    const [recommendation, setRecommendation] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const fetchRecommendation = async (sales: any) => {
        setLoading(true);

        try {
            // Assuming you're calling Groq's chat completions API
            const chatCompletion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content:
                            "You are a data analysist who provides insights on sales data and recommendations to further improve sales.",
                    },
                    {
                        role: "user",
                        content: `Based on the following sales data (in Philippine Pesos), provide an in-depth analysis and recommendations (atleast 10). The output should be in HTML format with Tailwind CSS styling, dont add greeting, following this pattern:
                
                        "<div class='bg-gray-100 p-6 rounded-lg shadow-md'>
                            <h2 class='text-2xl font-bold text-gray-800 mb-4'>Insights</h2>
                            <ul class='list-disc list-inside text-gray-700'>
                                <li>Insight 1</li>
                                <li>Insight 2</li>
                                <li>Insight 3</li>
                            </ul>
                        </div>
                        <div class='bg-blue-100 p-6 rounded-lg shadow-md mt-4'>
                            <h2 class='text-2xl font-bold text-blue-800 mb-4'>Recommendations</h2>
                            <ul class='list-disc list-inside text-blue-700'>
                                <li>Recommendation 1</li>
                                <li>Recommendation 2</li>
                                <li>Recommendation 3</li>
                            </ul>
                        </div>"
                
                        Sales Data: ${JSON.stringify(sales)}
                        Total Sales: ${total_sales}
                        Total Sales Count: ${sales_count}
                        `,
                    },
                ],

                // messages: [
                //     {
                //         role: "system",
                //         content:
                //             "You are a helpful assistant who provides insights on sales data and recommendation to further improve sales",
                //     },
                //     {
                //         role: "user",
                //         content: `Based on the following sales data, sales are in philippine peso, provide an analysis and recommendations: ${JSON.stringify(
                //             sales
                //         )}.
                //         Provide an output in HTML FORMAT. with pattern "<div>
                //         insights
                //         </div>
                //         <ul>
                //         recommendation
                //         </ul>",
                //         `,
                //     },
                // ],
                model: "llama3-8b-8192",
                temperature: 1,
                max_tokens: 1024,
                top_p: 1,
                stream: false, // Set to false for non-streaming response
                stop: null,
            });

            // Process the response and update the state
            setRecommendation(
                chatCompletion.choices[0]?.message.content ||
                    "No recommendation available."
            );

            console.log(
                "Recommendation:",
                chatCompletion.choices[0]?.message.content
            );
        } catch (error) {
            console.error("Error fetching recommendation:", error);
            setRecommendation("Error fetching recommendation.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecommendation(sales);
    }, [sales]);

    const formatRecommendation = (text: string) => {
        // Split the recommendation text by paragraphs (assumes each paragraph is separated by two newlines)
        const paragraphs = text.split("\n\n").map((paragraph, index) => (
            <div key={index}>
                {parse(paragraph)}
                <br />
            </div>
        ));
        return paragraphs;
    };

    return (
        <div className="recommendation-container p-5 border-2 border-gray-300 rounded-md shadow-md h-fit bg-white w-full">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-start text-gray-800">
                    Analysis
                </h2>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3"
                    onClick={() => fetchRecommendation(sales)} // Pass the sales data on click
                >
                    Generate
                </button>
            </div>
            <hr className="my-4 border-2" />
            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : (
                <div className="text-lg text-gray-700">
                    {formatRecommendation(recommendation)}{" "}
                    {/* Render formatted recommendation with <br /> after each paragraph */}
                </div>
            )}
        </div>
    );
};

export default Recommendation;
