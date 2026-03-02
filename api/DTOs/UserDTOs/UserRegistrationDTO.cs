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
        public string? FirstName { get; set;}
        public string? LastName { get; set; }
        [Required(ErrorMessage = "Email cannot be empty!")]
        [EmailAddress(ErrorMessage = "Needs to be a valid email!")]
        public string Email { get; set; } = string.Empty;
    }
}