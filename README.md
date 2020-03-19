# AssemblyVersion

This Github Action sets the AssemblyVersion of the given csproj to the next revision/build number.
The format is fixed for now:
yyyy.mm.dd.xx

Where xx is first read from the existing file and then increased by 1.
