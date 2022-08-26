import { EventArgs } from "@tuval/core";

export class QueryAccessibilityHelpEventArgs extends EventArgs
    {
        private  helpNamespace:string = '';
        private  helpString:string = '';
        private  helpKeyword:string = '';
        public get HelpKeyword():string
        {
                return this.helpKeyword;
            }
        public    set HelpKeyword(value:string)
            {
                this.helpKeyword = value;
            }

        
        public get HelpNamespace():string
        {
                return this.helpNamespace;
            }
            public set HelpNamespace(value:string)
            {
                this.helpNamespace = value;
            }

        
        public get HelpString(): string
        {
                return this.helpString;
            }
            public set HelpString(value: string)
            {
                this.helpString = value;
            }

       

        public constructor( helpNamespace:string,  helpString:string,  helpKeyword:string)
        {
            super();
            this.helpNamespace = helpNamespace;
            this.helpString = helpString;
            this.helpKeyword = helpKeyword;
        }
    }