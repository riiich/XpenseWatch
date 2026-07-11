using api.Enums;

namespace api.Models;

public class S3Metadata
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public int? TransactionId { get; set; }
    public string S3Key { get; set; } = string.Empty;
    public UploadCategory FileCategory { get; set; }
    public S3MetadataStatus Status { get; set; } = S3MetadataStatus.Pending;
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastRetrieved { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string MimeType { get; set; } = string.Empty;
    public long FileSize { get; set; }
}