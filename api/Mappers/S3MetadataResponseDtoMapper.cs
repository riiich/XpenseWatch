using api.DTOs;
using api.Models;

namespace api.Mappers;

public static class S3MetadataResponseDtoMapper
{
    public static S3MetadataResponseDto MapS3MetadataToS3MetadataResponseDto(S3Metadata item, string fileUrl)
    {
        return new S3MetadataResponseDto
        {
            Id = item.Id,
            userId = item.UserId,
            Status = item.Status,
            UploadedAt = item.UploadedAt,
            LastRetrieved = item.LastRetrieved,
            FileName = item.FileName,
            MimeType = item.MimeType,
            FileSize = item.FileSize,
            FileUrl = fileUrl
        };
    }
}