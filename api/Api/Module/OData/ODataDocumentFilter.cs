using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Api
{
    public class ODataDocumentFilter : IDocumentFilter
    {
        public void Apply(OpenApiDocument swaggerDoc, DocumentFilterContext context)
        {
            foreach (var path in swaggerDoc.Paths)
            {
                foreach (var operation in path.Value.Operations.Values)
                {
                    foreach (var response in operation.Responses)
                    {
                        foreach (var content in response.Value.Content)
                        {
                            // Remove OData streaming content type
                            //if (content.Key.Contains("odata.streaming") || content.Key.Contains("odata.metadata") || content.Key.Contains("IEEE754Compatible"))
                            if (!content.Key.Equals("application/json"))
                            {
                                response.Value.Content.Remove(content.Key);
                            }
                        }
                    }
                    if (operation.RequestBody?.Content != null)
                    {
                        foreach (var content in operation.RequestBody.Content)
                        {
                            // Remove OData streaming content type
                            //if (content.Key.Contains("odata.streaming") || content.Key.Contains("odata.metadata") || content.Key.Contains("IEEE754Compatible"))
                            if (!content.Key.Equals("application/json"))
                            {
                                operation.RequestBody.Content.Remove(content.Key);
                            }
                        }
                    }
                }
            }
        }
    }
}
