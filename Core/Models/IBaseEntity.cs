namespace Core
{
    public interface IBaseEntity
    {
        public long Id { get; set; }
        public DateTimeOffset CreatedOn { get; set; }
        public DateTimeOffset UpdatedOn { get; set; }
        public long? CreatedByUserId { get; set; }
        public long? UpdatedByUserId { get; set; }

    }
}