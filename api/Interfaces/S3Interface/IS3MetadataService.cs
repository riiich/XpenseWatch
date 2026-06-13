using api.Models;

namespace api.Interfaces;

public interface IS3MetadataService
{
    Task<S3Metadata?> GetByIdAsync(int id);

    Task<S3Metadata?> GetByuserIdAndIdAsync(string userId, int s3MetadataId);

    Task<IReadOnlyList<S3Metadata>> GetByuserIdAsync(string userId);

    Task DeleteAsync(S3Metadata item);

    Task<S3Metadata?> MarkRetrievedAsync(int id);
}