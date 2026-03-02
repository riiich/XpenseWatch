using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace api.Models
{
    public class User : IdentityUser
    {
        public string? FirstName { get; set;} = null;
        public string? LastName { get; set; } = null;
        public DateTime CreatedAt { get; set; }
        public List<Account> Accounts { get; set; } = new List<Account>();
    }
}