import { WorkspaceConfiguration } from 'vscode';
import * as JiraApi from 'jira-client';
import { statusKeys } from './const';
import * as vscode from 'vscode';

export interface IBaseConfig { 
    baseUrl?: string;
    port?: string;
    username?: string;
    apiToken?: string;
    jqlExpression?: string;
    password?: string; // deprecated
    project?: string | string[];
}

export interface IJiraIssue {
    id: string;
    key: string;
    fields: {
      summary: string;
      description: string;
      created: string;
      updated: string;
      assignee?: {
        accountId: string;
        displayName: string;
        emailAddress: string;
        active: boolean;
        name: string;
      };
      reporter?: {
        accountId: string;
        displayName: string;
        emailAddress: string;
        active: boolean;
      };
      status: {
        name: statusKeys;
      };
      priority: {
        name: string;
      };
      issuetype: {
        name: string;
      };
    };
    self: string
  }

interface IExtensionConfig extends WorkspaceConfiguration, IBaseConfig {}

class Service {
    public isInFaultedState: boolean = false;
    public errorMessage: string = '';
    private api!: JiraApi | null;
    public config: IExtensionConfig | null = null;
    public doneId: string | null = null;

    async setConfiguration(config: IExtensionConfig) {
        try {
            if (!config.baseUrl) {
                throw new Error('Missing configuration jira-issue.baseUrl. Please update vscode settings, you can open command pallete (F1 or CMD + SHIFT + P) and search for jira baseUrl.');
            }
            if (!config.bearer) {
                if (config.username && !config.password) {
                    throw new Error('Missing configuration jira-issue.password. Please update vscode settings, you can open command pallete (F1 or CMD + SHIFT + P) and search for jira password.');
                }

                if (!config.username) {
                    throw new Error('Missing configuration jira-issue.bearer(You can also use username). Please update vscode settings, you can open command pallete (F1 or CMD + SHIFT + P) and search for jira bearer.');
                }
            }
            const baseUrl = config.baseUrl.endsWith('/') ? config.baseUrl.slice(0, -1) : config.baseUrl;
            const [protocol, host] = baseUrl.split('://');
            const bearer = config.bearer;
            if(!host || (protocol !== 'http' && protocol !== 'https')) {
                throw new Error('Please provide a valid base url (start with http or https).');
            }
            const username = config.username;
            const password = config.password;
            const jiraApiOptions = {
                protocol,
                host,
                bearer,
                username,
                password,
                apiVersion: '2',
                port: config.port || '443',
                strictSSL: false
            };
            this.api = new JiraApi(jiraApiOptions);
            this.config = { ...config, ...jiraApiOptions };
            await this.getCurrentUser();
            await this.getDoneStatus();
            this.isInFaultedState = false;
            this.errorMessage = '';
        } catch (e) {
            this.config = null;
            this.isInFaultedState = true;
            if (e instanceof Error) {
                this.errorMessage = e.message || 'An error occurred';
                if (e.message.includes('Unauthorized (401)')) {
                    this.errorMessage = 'Username or bearer token is incorrect';
                }
            }
            this.api = null;
        }
    }


    searchWithQueryFromConfig = async (jqlExpression: string) => {
        return await this.api?.searchJira(jqlExpression);
    };

    getCurrentUser = async () => {
        const res = await this.api?.getCurrentUser();
        if (this.config) {
            // @ts-ignore
            this.config.username = res.name;
        }
        // @ts-ignore
        return res.name;;
    };

    updateAssignee = async (issueKey: string, assigneeName?: string) => {
        if (!assigneeName) {
            assigneeName = this.config?.username || '';
        }
        return await this.api?.updateAssignee(issueKey, assigneeName);
    };

    getDoneStatus = async () => {
        const list = await this.api?.listStatus();
        const doneId = list?.find((item: { name: string }) => item.name === '完成' || item.name === 'Done')?.id;
        if (doneId !== undefined) {
            this.doneId = doneId;
        }
    };

    setTransition(issueKey: string, transition: { transition: { id: string }}) {
        return this.api?.transitionIssue(issueKey, transition);
    }

    transitionIssue(issueKey: string, issueId: string) {
        return this.api?.listTransitions(issueId)
            .then(async (issue) => {
                const transitionNames = issue.transitions.map((i: { name: string }) => ({...i, label: i.name}));
                return vscode.window
                    .showQuickPick(transitionNames, {
                        placeHolder: 'Please select the state to be changed',
                        onDidSelectItem: item => {
                            // @ts-ignore
                            return this.api?.transitionIssue(issueKey, { transition: { id: item.id } })
                                .then(() => {
                                    // @ts-ignore
                                    vscode.window.showInformationMessage(`Successfully updated sub-task ${issueKey} status to ${item.name}`);
                                })
                                .catch((error) => {
                                    vscode.window.showInformationMessage(`Failed to update sub-task ${issueKey} status: ${error}`);
                                });
                        }
                    });
            })
            .catch((error) => {
                vscode.window.showInformationMessage(`Failed to retrieve issue ${issueKey}: ${error}`);
            });
    }
}

export default new Service();