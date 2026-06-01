using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.TransactionDTOs
{
    public class TransactionUploadDTO
    {
        public required IFormFile StatementFile { get; set; }
        public int AccountId { get; set; }
    }
}