import { promisify } from 'util';
import { exec } from 'child_process';
import { Logger } from '@nestjs/common';

const execPromise = promisify(exec);

export async function executeCommand(cmd: string, password?: string) {
    try {
        // format command - delete line breaks and multiply whitespaces
        cmd = cmd.replace(/(?:\r\n|\r|\n)\s+/g, ' ');
        const command: string = password ? `echo ${password} | sudo -S ${cmd}` : cmd;

        Logger.verbose(`Command running...`, 'executeCommand');
        // tslint:disable-next-line:no-console
        console.log('command >>', command);
        const { stdout, stderr } = await execPromise(command);
        if (stderr) {
            Logger.verbose(stderr);
        }
        Logger.verbose(`Command execution finished!`, 'executeCommand');

        return stdout;
    } catch (e) {
        Logger.error(`Execute command error: \n ${e}`);
        throw new Error(e);
    }
}
