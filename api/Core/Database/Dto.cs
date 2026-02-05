namespace Core;

public interface Dto<TDTO, TEntity>
{
    TEntity MapTo(TDTO dto);
    TDTO MapFrom(TEntity entity);
}