using api.Enums;
using api.Models;

namespace api.Interfaces;

public interface IFileUploadWorkflowService
{
    Task<S3Metadata> UploadAsync(string userId, int? transactionId, FileUploadInput file, UploadCategory uploadCategory);
    Task DeleteReceiptAsync(string userId, int transactionId);
}