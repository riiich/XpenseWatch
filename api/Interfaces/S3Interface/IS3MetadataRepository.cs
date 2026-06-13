using api.Models;

namespace api.Interfaces;

public interface IS3MetadataRepository
{
    Task<S3Metadata> CreateAsync(S3Metadata item);

    Task<S3Metadata> UpdateAsync(S3Metadata item);

    Task<S3Metadata?> GetByIdAsync(int id);

    Task<S3Metadata?> GetByuserIdAndIdAsync(string userId, int s3MetadataId);

    Task<IReadOnlyList<S3Metadata>> GetByuserIdAsync(string userId);

    Task<S3Metadata?> UpdateLastRetrievedAsync(int id);

    Task DeleteAsync(S3Metadata item);
}