#!/usr/bin/env node
import * as argparse from 'argparse';

import { PasswordService } from '../lib/model/PasswordService';
import { HmacPasswordService } from '../lib/provider/HmacPasswordService';
import { BCryptPasswordService } from '../lib/provider/BCryptPasswordService';

interface ArgsObj {
    hashingType: 'hmac' | 'bcrypt';
    secret: string;
    rounds: number;
    input: string;
    timing: boolean;
}

const parser = new argparse.ArgumentParser({
    version: require('../package.json').version,
    addHelp: true,
    description: 'Tool to hash passwords using bcrypt'
});

parser.addArgument(['--timing', '-t'], {
    help: 'Outputs the timing for the hashing operation',
    action: 'storeTrue'
});

const hashingSubparser = parser.addSubparsers({
    title: 'hashingType',
    dest: 'hashingType',
    description: 'Type of hashing to apply'
});

const hmacParser = hashingSubparser.addParser('hmac', { addHelp: true });
const bcryptParser = hashingSubparser.addParser('bcrypt', { addHelp: true });

hmacParser.addArgument(['--secret', '-s'], {
    help: 'Secret to use for the hashing',
    required: true
});

hmacParser.addArgument(['--input', '-i'], {
    help: 'Input to be hashed',
    required: true
});

bcryptParser.addArgument(['--rounds', '-r'], {
    help: 'Number of rounds to apply ion BCrypt hashing',
    type: v => parseInt(v),
    required: true
});

bcryptParser.addArgument(['--input', '-i'], {
    help: 'Input to be hashed',
    required: true
});

const args: ArgsObj = parser.parseArgs();
let passwordService: PasswordService;
switch (args.hashingType) {
    case 'hmac':
        passwordService = new HmacPasswordService({ secret: args.secret });
        break;
    case 'bcrypt':
        passwordService = new BCryptPasswordService({ rounds: args.rounds });
        break;
    default:
        throw new Error('Invalid hashing type specified');
}
(async function() {
    if (args.timing) console.time('Hashing Time');
    console.log(await passwordService.hash(args.input));
    if (args.timing) console.timeEnd('Hashing Time');
})();
