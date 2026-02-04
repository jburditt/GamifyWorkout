using AutoMapper;
using Core;

namespace Api
{
    /// <summary>
    /// wrapper for AutoMapper
    /// </summary>
    public class AutoMapperService : IMappingService
    {
        private readonly IMapper _mapper;

        public AutoMapperService(IMapper mapper)
        {
            _mapper = mapper;
        }

        /// <summary>
        /// This is the default map method. Configure the map in Startup file.
        /// </summary>
        /// <typeparam name="TSource">Source object to copy fields from</typeparam>
        /// <typeparam name="TDestination">Destination object to copy fields to</typeparam>
        /// <param name="source">Source object</param>
        /// <returns></returns>
        public TDestination Map<TSource, TDestination>(TSource source)
        {
            return _mapper.Map<TDestination>(source);
        }

        /// <summary>
        /// This is the default map method. Configure the map in Startup file.
        /// </summary>
        /// <typeparam name="TSource">Source object to copy fields from</typeparam>
        /// <typeparam name="TDestination">Destination object to copy fields to</typeparam>
        /// <param name="source">Source object</param>
        /// <returns></returns>
        public TDestination Map<TSource, TDestination>(TSource source, TDestination destination)
        {
            return _mapper.Map(source, destination);
        }

        /// <summary>
        /// This will also map with no configuration but is not pre-compiled on startup and will not be as performant
        /// </summary>
        /// <typeparam name="TSource">Source object to copy fields from</typeparam>
        /// <typeparam name="TDestination">Destination object to copy fields to</typeparam>
        /// <param name="source">Source object</param>
        /// <returns></returns>
        public static TDestination NoncompiledMap<TSource, TDestination>(TSource source)
        {
            var config = new MapperConfiguration(cfg => cfg.CreateMap<TSource, TDestination>(MemberList.Source));
            var mapper = new Mapper(config);
            return mapper.Map<TDestination>(source);
        }
    }
}