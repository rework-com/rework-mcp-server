class Responder {
    /**
     * Creates a response with optional sponsorship message
     */
    public static createResponse(data: any, includeSponsorMessage: boolean = false): { content: { type: string; text: string }[] } {
        const content: { type: string; text: string }[] = [];

        // Special handling for workspace hierarchy which contains a preformatted tree
        if (data && typeof data === 'object' && 'hierarchy' in data && typeof data.hierarchy === 'string') {
            // Handle workspace hierarchy specially - it contains a preformatted tree
            content.push({
                type: "text",
                text: data.hierarchy
            });
        } else if (typeof data === 'string') {
            // If it's already a string, use it directly
            content.push({
                type: "text",
                text: data
            });
        } else {
            // Otherwise, stringify the JSON object
            content.push({
                type: "text",
                text: JSON.stringify(data, null, 2)
            });
        }



        return { content };
    }
}

export default Responder;