// ES Module loader for development mode
import { pathToFileURL } from 'node:url';
import { register } from 'node:module';

// Register Babel loader for ES modules
register('@babel/register', pathToFileURL('./'));