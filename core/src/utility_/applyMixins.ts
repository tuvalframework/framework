export function applyMixins(derivedConstructor:any, baseConstructors:any[]):void
{
	baseConstructors
		.forEach(
			bc =>
			{
				Object.getOwnPropertyNames(bc.prototype).forEach(
					name =>
					{
						derivedConstructor.prototype[name] = bc.prototype[name];
					}
				);
			}
		);
}
