using api.Models;

namespace api.Interfaces;

public interface IS3MetadataService
{
    Task<S3Metadata?> GetByIdAsync(int id);
    Task<S3Metadata?> GetByUserIdAndIdAsync(string userId, int s3MetadataId);
    Task<IReadOnlyList<S3Metadata>> GetByUserIdAsync(string userId);
    Task<S3Metadata?> GetByTransactionIdAsync(int transactionId);
    Task DeleteAsync(S3Metadata item);
    Task<S3Metadata?> MarkRetrievedAsync(int id);
}