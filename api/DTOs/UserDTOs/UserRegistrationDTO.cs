using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.UserDTOs
{
    // WORK ON IT LATER (AUTH), NEED TO IMPLEMENT PASSWORD AND EMAIL VALIDATION LATER
    public class UserRegistrationDTO
    {
        [Required]
        public string? FirstName { get; set;}
        public string? LastName { get; set; } = string.Empty;
        [Required(ErrorMessage = "Username cannot be empty!")]
        public string? Username { get; set; }
        [Required(ErrorMessage = "Email cannot be empty!")]
        // [EmailAddress(ErrorMessage = "Needs to be a valid email!")]
        [RegularExpression(@"^[^@\s]+@[^@\s]+\.[a-zA-Z]${2,}$", ErrorMessage = "Email must have a valid domain extension (eg, .com, .org, ...)")]
        public string? Email { get; set; } = string.Empty;
        [Required]
        public string? Password { get; set; }
    }
}