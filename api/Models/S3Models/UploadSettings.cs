namespace api.Models
{
    public class UploadSettings
    {
        public string[] AcceptedTypes { get; set; } = ["application/pdf", "text/csv", "image/jpg", "image/jpeg", "image/png"];

        public string[] AcceptedExtensions { get; set; } = [".pdf", ".csv", ".jpg", ".jpeg", ".png"];

        public long MaxFileSizeBytes { get; set; } = 10 * 1024 * 1024;
    }
}
