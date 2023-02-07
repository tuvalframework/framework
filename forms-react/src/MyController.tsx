import { cTop } from "./Constants";
import { Text } from './components/Text/Text';
import { State, UIController } from "./UIController";
import { UIViewClass } from "./components/UIView/UIViewClass";
import { VStack } from "./layout/VStack/VStack";
//import { TextField } from 'monday-ui-react-core';
import { TextField } from "./components/TextField/TextField";
import { CheckBox } from './components/Checkbox/Checkbox';
import { Chips } from './components/Chips/Chips';
import { ColorPicker } from './components/ColorPicker/ColorPicker';
import { MenuButton } from './components/MenuButton/MenuButton';
import { EditableHeader } from './components/EditableHeader/EditableHeader';
import { Dropdown } from "./components/Dropdown/Dropdown";
import { Editor } from './components/Editor/Editor';
import { InputGroup } from './components/InputGroup/InputGroup';
import { InputMask } from './components/InputMask/InputMask';
import { InputSwitch } from './components/InputSwitch/InputSwitch';
import { InputNumber } from './components/InputNumber/InputNumber';
import { InputTextArea } from "./components/InputTextarea/InputTextarea";
import { Knob } from './components/Knob/Knob';
import { int } from "@tuval/core";
import { ListBox } from './components/ListBox/ListBox';

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

    @State([{
        name: 'test',
        value: '1'
    },
    {
        name: 'test1',
        value: '2'
    },
    {
        name: 'test2',
        value: '3'
    }
    ])
    private dropDownDataSource: object[];

    @State('1')
    private dropDownSelectedValue: string;

    @State('')
    private editorValue: string;


    @State(false)
    private inputSwitchValue: boolean;

    @State(0)
    private inputNumberValue: number;

    @State('')
    private textAreaValue: string;

    @State(0)
    private knobValue: int;

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
                Chips().value(this.chipsValue).onChange((e) => this.chipsValue = e),
                ColorPicker().value(this.colorPickerValue).onChange((e) => this.colorPickerValue = e),
                MenuButton(),
                EditableHeader(),
                Dropdown()
                    .width('100%')
                    .value(this.dropDownSelectedValue)
                    .model(this.dropDownDataSource)
                    .fields({ text: 'name', value: 'value' })
                    .onChange(e => this.dropDownSelectedValue = e),
                Text(this.editorValue),
                Editor().value(this.editorValue).onChange(e => this.editorValue = e).height(320),
                InputGroup(),
                InputMask(),
                InputSwitch().value(this.inputSwitchValue).onChange(e => this.inputSwitchValue = e),
                InputNumber().value(this.inputNumberValue).onChange(e=> this.inputNumberValue = e),
                InputTextArea().value(this.textAreaValue).onChange(e=> this.textAreaValue = e).width('100%'),
                Knob().value(this.knobValue).onChange(e=> this.knobValue = e),
                ListBox().model(this.dropDownDataSource).value(this.dropDownSelectedValue)
                .fields({text:'name', value: 'value'})
                .onChange(e=> this.dropDownSelectedValue = e)
            )
        )
    }
}