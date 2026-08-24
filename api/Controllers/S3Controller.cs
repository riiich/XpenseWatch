using Microsoft.AspNetCore.Mvc;
using api.DTOs;
using api.Interfaces;
using api.Mappers;
using api.Models;
using api.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace api.Controllers
{
    [ApiController]
    [Route("/api/s3")]
    public class S3Controller : ControllerBase
    {
        private readonly IFileUploadWorkflowService _fileUploadWorkflowService;
        private readonly LinkGenerator _linkGenerator;
        private readonly IS3MetadataService _s3MetadataService;
        private readonly IS3FileUploadService _s3FileUploadService;

        public S3Controller(IFileUploadWorkflowService fileUploadWorkflowService, LinkGenerator linkGenerator,
                            IS3MetadataService s3MetadataService, IS3FileUploadService s3FileUploadService)
        {
            _fileUploadWorkflowService = fileUploadWorkflowService;
            _linkGenerator = linkGenerator;
            _s3MetadataService = s3MetadataService;
            _s3FileUploadService = s3FileUploadService;
        }

        [HttpPost]
        [Route("statements")]
        public async Task<IActionResult> StatementUpload(IFormFile uploadedFile, [FromForm] int transactionId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized("User ID is no where fucking found in the token...");
            }

            try
            {
                if (uploadedFile is null)
                {
                    return BadRequest("A file is required.");
                }

                await using Stream fileContent = uploadedFile.OpenReadStream();
                S3Metadata item = await _fileUploadWorkflowService.UploadAsync(userId, null, new FileUploadInput
                {
                    FileName = uploadedFile.FileName,
                    ContentType = uploadedFile.ContentType,
                    Length = uploadedFile.Length,
                    Content = fileContent
                },
                Enums.UploadCategory.Statement
                );

                string fileUrl = _linkGenerator.GetUriByAction(
                    HttpContext,
                    action: nameof(S3MetadataController.RetrieveFile),
                    controller: "S3Metadata",
                    values: new { userId = item.UserId, s3MetadataId = item.Id }) ?? string.Empty;

                S3MetadataResponseDto response = S3MetadataResponseDtoMapper.MapS3MetadataToS3MetadataResponseDto(item, fileUrl);

                return Ok(new { message = "File uploaded successfully.", item = response });
            }
            catch (ArgumentException e)
            {
                return BadRequest(e.Message);
            }
            catch (InvalidOperationException e)
            {
                return StatusCode(500, e.Message);
            }
        }

        [Authorize]
        [HttpGet]
        [Route("receipts/{transactionId:int}")]
        public async Task<IActionResult> GetReceiptFile([FromRoute] int transactionId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized("User ID is no where fucking found in the token...");
            }

            var s3Metadata = await _s3MetadataService.GetByTransactionIdAsync(transactionId, userId);

            if (s3Metadata is null) return NotFound("There is no S3 metadata available for this transaction...");

            var presignedUrl = _s3FileUploadService.GetPresignedUrl(s3Metadata.S3Key);

            return Ok(new { presignedUrl = presignedUrl, uploadedAt = s3Metadata.UploadedAt });
        }

        [Authorize]
        [HttpPost]
        [Route("receipts")]
        public async Task<IActionResult> ReceiptUpload(IFormFile receiptImage, [FromForm] int transactionId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized("User ID is no where fucking found in the token...");
            }

            try
            {
                if (receiptImage is null)
                {
                    return BadRequest("A file is required.");
                }

                await using Stream fileContent = receiptImage.OpenReadStream();
                S3Metadata item = await _fileUploadWorkflowService.UploadAsync(userId, (int)transactionId, new FileUploadInput
                {
                    FileName = receiptImage.FileName,
                    ContentType = receiptImage.ContentType,
                    Length = receiptImage.Length,
                    Content = fileContent
                },
                Enums.UploadCategory.Receipt
                );

                string fileUrl = _linkGenerator.GetUriByAction(
                    HttpContext,
                    action: nameof(S3MetadataController.RetrieveFile),
                    controller: "S3Metadata",
                    values: new { userId = item.UserId, s3MetadataId = item.Id }) ?? string.Empty;

                S3MetadataResponseDto response = S3MetadataResponseDtoMapper.MapS3MetadataToS3MetadataResponseDto(item, fileUrl);

                return Ok(new { message = "File uploaded successfully.", item = response });
            }
            catch (ArgumentException e)
            {
                return BadRequest(e.Message);
            }
            catch (InvalidOperationException e)
            {
                return StatusCode(500, e.Message);
            }
        }

        [Authorize]
        [HttpDelete]
        [Route("receipts/{transactionId:int}")]
        public async Task<IActionResult> DeleteReceipt([FromRoute] int transactionId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized("User ID is no where fucking found in the token...");
            }

            var receipt = await _s3MetadataService.GetByTransactionIdAsync(transactionId, userId);

            if(receipt is null)
            {
                return NotFound("Receipt was not found...");
            }

            // at this point, the receipt is valid and found, so attempt to delete
            try
            {
                await _fileUploadWorkflowService.DeleteReceiptAsync(userId, transactionId);

                return NoContent();
            }
            catch(KeyNotFoundException e)
            {
                return NotFound(e.Message);
            }
            catch(InvalidOperationException e)
            {
                return StatusCode(500, e.Message);
            }
        }

        // [Authorize]
        // [HttpPut]
        // [Route("receipt/{transactionId:int}")]
        // public async Task<IActionResult> UpdateReceipt()
        // {}
    }
}