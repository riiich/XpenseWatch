using api.Models;

namespace api.Interfaces;

public interface IFileUploadWorkflowService
{
    Task<S3Metadata> UploadAsync(string userId, FileUploadInput file);
}