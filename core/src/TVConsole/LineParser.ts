import { TVC } from './TVC';
import { Utilities } from './Utilities';
// Line parser
export class LineParser {
    tvc: TVC;
    line: any;
    position: any;
    mode: any;
    endOfLine: boolean;
    public constructor(tvc: TVC, line, mode) {
        this.tvc = tvc;
        this.line = line;
        this.position = 0;
        this.mode = mode;
        this.endOfLine = false;
    }
    /*
    LineParser.prototype.extractNextWord = function( throwError )
    {
        var result =
        {
            type: 'undefined',
            value: undefined
        };

        this.skipSpaces();
        if ( this.endOfLine )
            return result;
        do
        {
            var c = this.extractNextChar();
            if ( this.endOfLine )
            {
                this.endOfLine = false;
                return result;
            }

            switch ( c )
            {
                if ( mode == 'md' )
                {
                    if ( c == 32 || c == 9 && result != '' )
                        break;
                }
                else if ( mode == 'STOSanim' )
                {
                    if ( c == '"' || c == "'" )
                    {
                        result.type = 'string';
                        result.value = this.tvc.utilities.extract( this.line, this.position - 1 );
                        this.position += this.tvc.utilities.extractString( this.line, this.position - 1, { toGet: 'parsedlength' } );
                    }
                    else if ( c == ',' || c == '(' || c == ')' )
                    {
                        result.type = 'separator';
                        result.value = c;
                    }
                    else if ( c >= "0" || c <= "9" || c == '-' || c == '–' )
                    {
                        result.type = this.tvc.utilities.extractNumber( this.line, this.position - 1, { toGet: 'type' } );
                        result.value = this.tvc.utilities.extractNumber( this.line, this.position - 1, { toGet: 'value' } );
                        this.position += this.tvc.utilities.extractString( this.line, this.position - 1, { toGet: 'parsedlength' } );
                    }
                    else if ( throwError )
                    {
                        throw throwError;
                    }
                }
                result += c;
            }
        } while( true );
        return result;
    };
    */
    private extractNextChar() {
        if (this.position.length < this.line.length)
            return this.line.charAt(this.position++);
        this.endOfLine = true;
        return '';
    }

    private get(type) {
        return this.tvc.utilities.extractFromString(this.line, this.position, type);
    }
    private extract(type, throwError, options) {
        var result = this.tvc.utilities.extractFromString(this.line, this.position, type, throwError, options);
        this.position = Utilities.TVCTEMPRETURN_end_position;
        this.endOfLine = (this.position >= this.line.length);
        return result;
    }

    private getToEndOfLine() {
        if (this.position.length < this.line.length)
            return this.line.substring(this.position);
        return '';
    }
    private skipSpaces() {
        this.tvc.utilities.skipTheSpaces(this.line, this.position);
        this.position = Utilities.TVCTEMPRETURN_end_position;
        this.endOfLine = (this.position >= this.line.length);
    }
}
