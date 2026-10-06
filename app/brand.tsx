export default function Brand({priority=true}:{priority?:boolean}){
 return <a className="brand brandlogo" href="/" aria-label="DataScout home"><img src="/datascout-logo.png" alt="DataScout" width={240} height={54} loading={priority?'eager':'lazy'} decoding="async" fetchPriority={priority?'high':'auto'}/></a>;
}
