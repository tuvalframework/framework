import { cTop } from "./Constants";
import { Text } from './components/Text/Text';
import { State, UIController } from "./UIController";
import { UIViewClass } from "./UIView/UIViewClass";
import { VStack } from "./VStack/VStack";
//import { TextField } from 'monday-ui-react-core';
import { TextField } from "./components/TextField/TextField";
import { CheckBox } from './components/Checkbox/Checkbox';
import { Chips } from './components/Chips/Chips';
import { ColorPicker } from './components/ColorPicker/ColorPicker';
import { MenuButton } from './components/MenuButton/MenuButton';

const list = [{
    name: 'test'
},
{
    name: 'test1'
},
{
    name: 'test2'
}
];

export class MyController extends UIController {
    @State(10)
    public counter: number;

    @State("red")
    public color: string;

    @State("red")
    public text: string;

    @State(true)
    public checked: boolean;

    @State(["test"])
    public chipsValue: string[];

    @State([""])
    public colorPickerValue: string;

    public override LoadView(): UIViewClass {

        return (
            /*   ReactView(
                 <Fragment>
                     {
                         Array(500).fill(null).map((u, i) => i).map(() => {
                             return (
                                 <TextField
                                     iconName="fa fa-square"
                                     placeholder="Placeholder text here"
                                     showCharCount
                                     title="Name"
                                     validation={{
                                         text: 'Helper text'
                                     }}
                                     wrapperClassName="monday-storybook-text-field_size"
                                     value={this.text}
                                     onChange={(value)=> this.text = value}
                                 />
                             )
                         })
                     }
                 </Fragment>

             ) */


            /* VStack({ alignment: cTop, spacing: 10 })(
                ...ForEach(Array(100).fill(null).map((u, i) => i))(() =>
                    HStack({ alignment: cLeading })(
                        Label((this.counter).toString())
                        .tooltip("Test tooltip")
                            .background(this.color)
                            .onClick(() => {
                                const a = this.counter;
                                this.counter = a + 1;
                                this.color = "gray";
                            }),

                       AutoComplete().datasource(list).field('name')
                       .completeMethod((query) => list.filter( item => item.name.indexOf(query)))
                       .onChange(e => console.log(e)),
                      Calendar().showIcon(true)
                    )
                )
            ) */
            VStack({ alignment: cTop, spacing: 10 })(
                TextField(),
                Text((this.counter).toString())
                .tooltip("Test tooltip")
                    .background(this.color)
                    .onClick(() => {
                        const a = this.counter;
                        this.counter = a + 1;
                        this.color = "gray";
                    }),
                    CheckBox().checked(this.checked).labelView(
                        Text("Hans")
                    )
                    .onChange((e) => this.checked = e),
                    Chips().value(this.chipsValue).onChange((e)=> this.chipsValue = e),
                    ColorPicker().value(this.colorPickerValue).onChange((e)=> this.colorPickerValue = e),
                    MenuButton()

             )
        )
    }
}