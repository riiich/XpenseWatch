using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace api.Data
{
    public class ApplicationDBContext : IdentityDbContext<User>
    {
        public ApplicationDBContext(DbContextOptions options) : base(options) {}

        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Goal> Goals { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // if any issues with CreatedAt dates, handle them here
            builder.Entity<User>().Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
            builder.Entity<Transaction>().Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
            builder.Entity<Account>().Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
            builder.Entity<Goal>().Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");

            // configure way to store money
            builder.Entity<Account>().Property(x => x.Balance).HasPrecision(18, 2);
            builder.Entity<Goal>().Property(x => x.CurrentBalance).HasPrecision(18, 2);
            builder.Entity<Goal>().Property(x => x.TargetBalance).HasPrecision(18, 2);
            builder.Entity<Transaction>().Property(x => x.Amount).HasPrecision(18, 2);

            List<IdentityRole> roles = new List<IdentityRole>
            {
                new IdentityRole
                {
                    Id = "7358a98a-7232-4740-843e-32408b07897c",
                    Name = "Admin",
                    NormalizedName = "ADMIN"
                },
                new IdentityRole
                {
                    Id = "1f92e21b-2524-4f0e-9494-067645300f5c",
                    Name = "User",
                    NormalizedName = "USER"
                }
            };

            builder.Entity<IdentityRole>().HasData(roles);
        }
    }
}