using Core;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Database
{
    public class UserConfiguration : EntityBaseConfiguration<User>
    {
        public override void ConfigureProperties(EntityTypeBuilder<User> builder)
        {
            builder.Ignore(e => e.CreatedByUser);
            builder.Ignore(e => e.UpdatedByUser);
        }
    }
}
