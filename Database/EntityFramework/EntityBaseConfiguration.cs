using Core;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace Database
{
    public abstract class EntityBaseConfiguration<T> : IEntityTypeConfiguration<T> where T : class, IBaseEntity
    {
        public virtual void Configure(EntityTypeBuilder<T> builder)
        {
            builder.Property(e => e.CreatedOn)
                .IsRequired();
            builder.Property(e => e.UpdatedOn)
                .IsRequired();
            ConfigureProperties(builder);
        }

        public abstract void ConfigureProperties(EntityTypeBuilder<T> builder);
    }
}
