import { DomHandler } from '../../DomHandler';
import { Control } from '../Control';
import { Teact } from '../../Teact';
import { Event, is, Delegate, classNames } from '@tuval/core';
import { LinkedIn } from '../../authentication/LinkedIn';
declare var gaEvent;
const css = require('./LoginForm.css');
DomHandler.addCssToDocument(css);

class ClickEvent extends Delegate<() => void>{ }

export class LoginForm extends Control<LoginForm> {

     public get _OnClick(): Event<ClickEvent> {
        return this.GetProperty('OnClick');
    }
    public set _OnClick(value: Event<ClickEvent>) {
        this.SetProperty('OnClick', value);
    }
    public get OnLogin(): Event<ClickEvent> {
        return this.GetProperty('OnLogin');
    }
    public set OnLogin(value: Event<ClickEvent>) {
        this.SetProperty('OnLogin', value);
    }

    /*  public SetupComponentDefaults(): any {
         super.SetupComponentDefaults();
         this.OnClick = new Event();
         this.Visible = true;
     } */

    private renderLinkedInLogin() {
        return (
            <LinkedIn
                clientId="778pqts64cj8sr"
                redirectUri={`${window.location.origin}/apps`}
                scope="r_emailaddress,r_liteprofile"
                state="34232423"
                onFailure={() => alert('fail')}
                onSuccess={(e) => {
                    console.log(e.code);
                    this._OnClick();
                    /*  const req = new GetProfileRequest(e.code);
                     req.HandshakeId = 100;
                     req.Send().then(e=> console.log(e)); */
                    fetch('https://bpmgenesis.herokuapp.com/code/' + e.code, {
                        method: 'GET',
                    })
                        .then(response => response.json())
                        .then(result => {
                            console.log('Success:', result);
                            gaEvent('Login', 'Success', result.nameSurname + '(' + result.email + ')');
                            this.OnLogin(result);
                            this._OnClick();
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });

                    /*  var xhr = new XMLHttpRequest();
                     xhr.open("POST", 'https://cors-anywhere.herokuapp.com/https://www.linkedin.com/oauth/v2/accessToken');

                     xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                     xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4) {
                           console.log(xhr.status);
                           console.log(xhr.responseText);
                        }};

                     var data = "grant_type=authorization_code&code=" + e.code +"&redirect_uri=http://192.168.56.1:8080/test/&client_id=778pqts64cj8sr&client_secret=zQNAmuU75XiZrMIe";

                     xhr.send(data); */
                }}
                supportIE
                redirectPath='/apps'
            >
                <img src={'/static/assets/linkedin.png'} alt="Log in with Linked In" style={{ maxWidth: '180px' }} />
            </LinkedIn>
        );
    }
    private renderTuvalLogin() {
        return (<div class="login-form" role="log" aria-live="assertive" style="width: 320px;">
            <div class="login-inner-panel" style="width: 320px;">
                <div class="x-panel-bwrap">
                    <div class="ext-gen37" style="width: 320px;">
                        <div class="sds-icon-text-field "><div class=" icon-user-icon"></div>
                            <input type="text" class="x-form-text-x-form-field-textfield" id="login_username" name="username" maxlength="256" aria-describedby="ext-gen52"
                                aria-label="Kullanıcı adı" aria-readonly="false" aria-required="false" aria-disabled="false" aria-invalid="false" />
                            <div role="presentation" class="x-form-hidden-error-msg"></div>
                        </div>
                        <div class="sds-icon-text-field">
                            <div class="icon-passwd-icon"></div>
                            <input type="password" class="x-form-text-x-form-field-textfield" id="login_passwd" name="passwd" maxlength="256" autocomplete="off"
                                aria-describedby="ext-gen53" aria-label="Parola" aria-readonly="false" aria-required="false" aria-disabled="false" />
                            <div role="presentation" class="x-form-hidden-error-msg" id="ext-gen53"></div>
                        </div>
                        <div class="sds-icon-text-field-x-hide-display">
                            <div id="ext-comp-1022" class="icon-otp-icon"></div>
                            <input class="x-form-text-x-form-field-textfield-x-form-empty-field" type="text" id="login_otp" name="OTPcode" maxlength="8"
                                autocomplete="off" aria-describedby="ext-gen54" aria-label="6 basamaklı kodu girin" aria-readonly="false" aria-required="false"
                                aria-disabled="false" placeholder="6 basamaklı kodu girin" />
                            <div role="presentation" class="x-form-hidden-error-msg" id="ext-gen54"></div>
                        </div>
                        <div class="x-form-check-wrap-syno-ux-form-check-wrap" id="ext-gen46" style="margin-left: 0px; width: 278px;">
                            <input type="checkbox" role="checkbox" autocomplete="off" class="syno-ux-checkbox-icon-x-form-checkbox-x-form-field" id="login_rememberme"
                                name="rememberme" aria-describedby="ext-gen45" aria-label="Oturum açık kalsın" aria-readonly="false" aria-required="false"
                                aria-disabled="false" aria-level="1" aria-checked="false" aria-invalid="false" aria-labelledby="login_rememberme-label-el" />
                            <div class="syno-ux-checkbox-icon" id="login_rememberme-icon-el"></div>
                            <label for="login_rememberme" class="syno-ux-checkbox-label" id="login_rememberme-label-el">Oturum açık kalsın</label>
                            <div role="presentation" class="x-form-hidden-error-msg" id="ext-gen45"></div>
                        </div>
                        <span onClick={() => { this._OnClick(); }} cellspacing="0" class="login-btn"
                            style="margin-left: 0px; width: 278px; height: 38px;"><em class=" x-unselectable" unselectable="on">
                                <button type="button" aria-label="Oturum aç" class="x-btn-text" aria-level="1" aria-disabled="undefined">Oturum aç</button>
                            </em></span>
                    </div>
                </div>
            </div>
        </div>);
    }
    public CreateElements(): any {
        return (

            <div class='sds-login-light' style='background-color: rgb(76, 143, 191);'>
                <div class="sds-login-background" style="width: 100%; height: 100%;">
                    <div>
                        <div style="background-color: #4c8fbf; width: 100%; height: 100%; visibility: visible;">
                            <img style="position: absolute; visibility: visible; width: 100%; height: 100%; left: 0px; top: 0px;"
                                src="/static/images/back01.jpg" draggable="false" /></div>
                    </div>
                </div>
                <div class="sds-login-dialog" style="height: auto; left: 621px; top: 224.5px;">
                    <div class="sds-login-dialog-form" role="log" aria-live="assertive" style="width: 360px;">
                        <div class='sds-login-dialog-title'>BPM Genesis</div>
                        <div class='x-plain-bwrap'>
                            {this.renderLinkedInLogin()}
                        </div>
                    </div>
                </div>
            </div>



        );
    }
}
