using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedOwnerIdToUserId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "OwnerId",
                table: "S3Metadata",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_S3Metadata_OwnerId",
                table: "S3Metadata",
                newName: "IX_S3Metadata_UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "S3Metadata",
                newName: "OwnerId");

            migrationBuilder.RenameIndex(
                name: "IX_S3Metadata_UserId",
                table: "S3Metadata",
                newName: "IX_S3Metadata_OwnerId");
        }
    }
}
