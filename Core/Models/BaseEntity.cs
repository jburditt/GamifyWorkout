using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Core
{
    public abstract class BaseEntity : IBaseEntity
    {
        public BaseEntity()
        {
            CreatedOn = DateTimeOffset.Now;
            UpdatedOn = DateTimeOffset.Now;
        }

        [Key]
        public Guid Id { get; set; }

        [JsonIgnore]
        public DateTimeOffset CreatedOn { get; set; }

        [JsonIgnore]
        public DateTimeOffset UpdatedOn { get; set; }

        [JsonIgnore]
        public Guid? CreatedByUserId { get; set; }

        [JsonIgnore]
        public Guid? UpdatedByUserId { get; set; }

        [JsonIgnore]
        [NotMapped]
        public virtual User? CreatedByUser { get; set; }

        [JsonIgnore]
        [NotMapped]
        public virtual User? UpdatedByUser { get; set; }
    }
}