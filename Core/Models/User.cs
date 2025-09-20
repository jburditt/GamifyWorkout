﻿using System.ComponentModel.DataAnnotations;

namespace Core;

public class User
{
    [Key]
    [Display(Name = "OAuth Id")]
    public Guid? Id { get; set; }

    [Display(Name = "First Name")]
    public required string FirstName { get; set; }

    public required string LastName { get; set; }
    public required string Username { get; set; }
    public required string Email { get; set; }
}
