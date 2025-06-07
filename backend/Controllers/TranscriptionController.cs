using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Text.Json;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TranscriptionController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _httpClientFactory;

        // A small record to help deserialize the JSON response from Groq
        private record GroqTranscriptionResponse(string Text);

        public TranscriptionController(IConfiguration configuration, IHttpClientFactory httpClientFactory)
        {
            _configuration = configuration;
            _httpClientFactory = httpClientFactory;
        }

        [HttpPost]
        public async Task<IActionResult> TranscribeAudio(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "No file uploaded." });
            }

            if (file.Length > 25 * 1024 * 1024) // 25MB limit
            {
                return BadRequest(new { message = "File size exceeds the 25MB limit." });
            }

            var apiKey = _configuration["GROQ_API_KEY"];
            if (string.IsNullOrEmpty(apiKey) || apiKey == "YOUR_GROQ_API_KEY_HERE")
            {
                return StatusCode(500, new { message = "API key is not configured on the server." });
            }

            var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

            using var formData = new MultipartFormDataContent();
            formData.Add(new StreamContent(file.OpenReadStream()), "file", file.FileName);
            formData.Add(new StringContent("whisper-large-v3"), "model");
            formData.Add(new StringContent("json"), "response_format");
            formData.Add(new StringContent("0"), "temperature");

            try
            {
                var response = await client.PostAsync("https://api.groq.com/openai/v1/audio/transcriptions", formData);

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"Groq API Error: {errorContent}");
                    return StatusCode((int)response.StatusCode, new { message = $"Error from transcription service: {response.ReasonPhrase}" });
                }

                var jsonResponse = await response.Content.ReadAsStringAsync();
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var transcriptionResponse = JsonSerializer.Deserialize<GroqTranscriptionResponse>(jsonResponse, options);

                if (transcriptionResponse == null || string.IsNullOrEmpty(transcriptionResponse.Text))
                {
                    return StatusCode(500, new { message = "Failed to parse transcription response." });
                }

                return Ok(new { transcription = transcriptionResponse.Text });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return StatusCode(500, new { message = "An internal server error occurred during transcription." });
            }
        }
    }
}