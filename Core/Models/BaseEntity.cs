﻿using System.ComponentModel.DataAnnotations;

namespace Core
{
    public abstract class BaseEntity : IBaseEntity
    {
        [Key]
        public Guid Id { get; set; }
    }
}