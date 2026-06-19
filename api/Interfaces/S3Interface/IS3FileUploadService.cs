using api.Enums;
using api.Models;

namespace api.Interfaces
{
    public interface IS3FileUploadService
    {
        string CreateObjectKey(string fileName, UploadCategory uploadCategory);
        Task ValidateFileAsync(FileUploadInput file);
        Task UploadFileAsync(FileUploadInput file, string s3Key);
        Task DeleteFileAsync(string s3Key);
        string GetPresignedUrl(string s3Key);
    }
}
