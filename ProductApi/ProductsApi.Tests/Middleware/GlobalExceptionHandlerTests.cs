using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging.Abstractions;
using ProductsApi.Middleware;

namespace ProductsApi.Tests.Middleware;

public class GlobalExceptionHandlerTests
{
    [Fact]
    public async Task TryHandleAsync_WritesProblemDetailsAndReturnsTrue()
    {
        var handler = new GlobalExceptionHandler(NullLogger<GlobalExceptionHandler>.Instance);
        var httpContext = new DefaultHttpContext();
        httpContext.Request.Method = "GET";
        httpContext.Request.Path = "/api/categories/1";
        using var responseBody = new MemoryStream();
        httpContext.Response.Body = responseBody;

        var handled = await handler.TryHandleAsync(httpContext, new InvalidOperationException("boom"), CancellationToken.None);

        Assert.True(handled);
        Assert.Equal(StatusCodes.Status500InternalServerError, httpContext.Response.StatusCode);

        responseBody.Seek(0, SeekOrigin.Begin);
        var problemDetails = await JsonSerializer.DeserializeAsync<ProblemDetails>(responseBody);

        Assert.NotNull(problemDetails);
        Assert.Equal(StatusCodes.Status500InternalServerError, problemDetails!.Status);
        Assert.Equal("/api/categories/1", problemDetails.Instance);
    }
}
