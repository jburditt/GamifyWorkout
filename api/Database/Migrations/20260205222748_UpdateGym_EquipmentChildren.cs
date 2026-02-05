using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Database.Migrations
{
    /// <inheritdoc />
    public partial class UpdateGym_EquipmentChildren : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_GymEquipment",
                table: "GymEquipment");

            migrationBuilder.AddPrimaryKey(
                name: "PK_GymEquipment",
                table: "GymEquipment",
                columns: new[] { "GymId", "EquipmentId" });

            migrationBuilder.CreateIndex(
                name: "IX_GymEquipment_EquipmentId",
                table: "GymEquipment",
                column: "EquipmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_GymEquipment_Equipment_EquipmentId",
                table: "GymEquipment",
                column: "EquipmentId",
                principalTable: "Equipment",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_GymEquipment_Gyms_GymId",
                table: "GymEquipment",
                column: "GymId",
                principalTable: "Gyms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GymEquipment_Equipment_EquipmentId",
                table: "GymEquipment");

            migrationBuilder.DropForeignKey(
                name: "FK_GymEquipment_Gyms_GymId",
                table: "GymEquipment");

            migrationBuilder.DropPrimaryKey(
                name: "PK_GymEquipment",
                table: "GymEquipment");

            migrationBuilder.DropIndex(
                name: "IX_GymEquipment_EquipmentId",
                table: "GymEquipment");

            migrationBuilder.AddColumn<Guid>(
                name: "GymEquipmentId",
                table: "Equipment",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_GymEquipment",
                table: "GymEquipment",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Equipment_GymEquipmentId",
                table: "Equipment",
                column: "GymEquipmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Equipment_GymEquipment_GymEquipmentId",
                table: "Equipment",
                column: "GymEquipmentId",
                principalTable: "GymEquipment",
                principalColumn: "Id");
        }
    }
}
