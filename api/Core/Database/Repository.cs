using System.Linq.Expressions;

namespace Core;

public interface Repository
{
    /// <summary>
    /// Gets all objects from database
    /// </summary>
    /// <returns></returns>
    IQueryable<T> All<T>(string[] includes = null) where T : class;

    /// <summary>
    /// Select Single Item by specified expression.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="expression"></param>
    /// <returns></returns>
    T Get<T>(Guid id, params Expression<Func<T, object>>[] includes) where T : class, Identifier;
    T Get<T>(Expression<Func<T, bool>> expression, string[] includes = null) where T : class;

    /// <summary>
    /// Find object by specified expression.
    /// </summary>
    /// <param name="predicate"></param>
    /// <returns></returns>
    T Find<T>(Expression<Func<T, bool>> predicate, string[] includes) where T : class;
    T Find<T>(Expression<Func<T, bool>> predicate, params Expression<Func<T, object>>[] includeProperties) where T : class;

    /// <summary>
    /// Gets objects from database by filter.
    /// </summary>
    /// <param name="predicate">Specified a filter</param>
    /// <returns></returns>
    IQueryable<T> Filter<T>(Expression<Func<T, bool>> predicate, params Expression<Func<T, object>>[] includes) where T : class;
    IQueryable<T> Filter<T>(Expression<Func<T, bool>> predicate, string[] includes = null) where T : class;

    /// <summary>
    /// Gets objects from database by filter and orders by query.
    /// </summary>
    /// <param name="predicate">Specified a filter</param>
    /// <param name="orderBy">Specified a query to order by</param>
    /// <returns></returns>
    IQueryable<T> FilterSort<T>(Expression<Func<T, bool>> filter = null, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null, string includeProperties = "") where T : class;

    /// <summary>
    /// Gets objects from database by filter and orders by query.
    /// </summary>
    /// <param name="predicate">Specified a filter</param>
    /// <param name="orderBy">Specified a query to order by</param>
    /// <returns></returns>
    IQueryable<T> FilterSort<T>(Expression<Func<T, bool>> filter = null, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null, params Expression<Func<T, object>>[] includeProperties) where T : class;

    /// <summary>
    /// Gets objects from database with filting and paging.
    /// </summary>
    /// <typeparam name="Key"></typeparam>
    /// <param name="filter">Specified a filter</param>
    /// <param name="total">Returns the total records count of the filter.</param>
    /// <param name="index">Specified the page index.</param>
    /// <param name="size">Specified the page size</param>
    /// <returns></returns>
    IQueryable<T> Filter<T>(Expression<Func<T, bool>> filter, out int total, int index = 0, int size = 50, string[] includes = null) where T : class;

    /// <summary>
    /// Gets the object(s) is exists in database by specified filter.
    /// </summary>
    /// <param name="predicate">Specified the filter expression</param>
    /// <returns></returns>
    bool Contains<T>(Expression<Func<T, bool>> predicate) where T : class;

    /// <summary>
    /// Create a new object to database.
    /// </summary>
    /// <param name="t">Specified a new object to create.</param>
    /// <returns></returns>
    T Insert<T>(T t) where T : class;

    /// <summary>
    /// Delete the object from database.
    /// </summary>
    /// <param name="t">Specified a existing object to delete.</param>
    int Delete<T>(T t) where T : class;

    /// <summary>
    /// Delete objects from database by specified filter expression.
    /// </summary>
    /// <param name="predicate"></param>
    /// <returns></returns>
    int Delete<T>(Expression<Func<T, bool>> predicate) where T : class;

    /// <summary>
    /// Delete objects from database by specified entity key.
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    int Delete<T>(object id) where T : class;

    /// <summary>
    /// Update object changes and save to database.
    /// </summary>
    /// <param name="t">Specified the object to save.</param>
    /// <returns></returns>
    int Update<T>(T t) where T : class;

    /// <summary>
    /// Update object properties and save to database.
    /// </summary>
    /// <param name="id">ID of the object.</param>
    /// <param name="properties">The object properties to save.</param>
    /// <returns></returns>
    T Update<T>(Guid id, Func<T, object>[] properties) where T : class, Identifier;

    /// <summary>
    /// Update object properties and save to database.
    /// </summary>
    /// <param name="id">ID of the object.</param>
    /// <param name="properties">The object properties to save.</param>
    /// <returns></returns>
    T Update<T>(Expression<Func<T, bool>> predicate, Func<T, object>[] properties) where T : class;

    /// <summary>
    /// Count items that match predicate
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="predicate"></param>
    /// <returns></returns>
    int Count<T>(Expression<Func<T, bool>> predicate) where T : class;

    /// <summary>
    /// Execute query and return queryable entity object list
    /// </summary>
    /// <param name="query"></param>
    /// <param name="parameters"></param>
    /// <returns></returns>
    //IQueryable<T> SelectQuery<T>(string query, params object[] parameters) where T : class;

    /// <summary>
    /// Executes the SQL or procedure.
    /// </summary>
    /// <param name="procedureCommand">The SQL or procedure command.</param>
    /// <param name="sqlParams">The SQL params.</param>
    //void ExecuteCommand(String procedureCommand, params SqlParameter[] sqlParams);
}
