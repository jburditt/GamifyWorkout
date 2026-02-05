using Core;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace Database
{
    public abstract class EntityBaseConfiguration<T> : IEntityTypeConfiguration<T> where T : class, Identifier
    {
        public virtual void Configure(EntityTypeBuilder<T> builder)
        {
            ConfigureProperties(builder);
        }

        public abstract void ConfigureProperties(EntityTypeBuilder<T> builder);
    }
}
