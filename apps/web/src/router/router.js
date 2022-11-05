import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home/home';
import SignUp from '@/components/Authentication/sign_up';
import SignIn from '@/components/Authentication/sign_in';
import SignInAgain from '@/components/Authentication/sign_in_again';
import SignedIn from '@/components/Authentication/signed_in';
import LogOut from '@/components/Authentication/log_out';
import Company from '@/components/Company/company';
import ContactUs from '@/components/ContactUs/contact_us';
import PrivacyPolicy from '@/components/Users/privacy_policy';
import Terms from '@/components/Users/terms';
import Services from '@/components/Services/services';
import RecentChanges from '@/components/Home/recent_changes';
import BestRefund from '@/components/Home/best_refund';
import TaxTips from '@/components/Home/tax_tips';
import FreeEFile from '@/components/Home/free_efile';
import InstantCash from '@/components/Home/instant_cash';
import FilesUploaded from '@/components/Users/files_uploaded';
import BookAppointment from '@/components/Users/book_appointment';
import MyAppointments from '@/components/Users/my_appointments';
import AdminPanel from '@/components/Admins/admin_panel';
import ViewAllDocuments from '@/components/Admins/view_all_documents';
import ViewAllAppointments from '@/components/Admins/view_all_appointments';
import AddAppointments from '@/components/Admins/add_appointments';
import UserPayments from '@/components/Users/payments';
import AdminPayments from '@/components/Admins/payments';
import UserApprovalRequests from '@/components/Admins/user_approval_requests';
import ViewAllUsers from '@/components/Admins/view_all_users';
import UserProfile from '@/components/Users/user_profile';
import ObjectList from '@/components/objects/list';
import Forms from '@/components/forms/list';
import Dashboards from '@/components/dashboards/list';
import Workflows from '@/components/workflows/list';
import WorkflowDesigner from '@/components/workflows/designer';
import Filters from '@/components/filters/list';
import FilterDesigner from '@/components/filters/designer';
import Charts from '@/components/charts/list';
import Points from '@/components/points/list';
import Users from '@/components/Users/list';
import CreateUserGroup from '@/components/Users/user-group-create';
import Object from '@/components/objects/object';
import UpdateUserGroup from '@/components/Users/user-group-update';
import FormDesigner from '@/components//forms/designer';
import Requests from '@/components/requests/list';
import RequestDesigner from '@/components/requests/designer';
import Studio from '@/components/studio/studio/index';
import Studios from '@/components/studio/list';
// import ProcessDesigner from '@/components//processes/designer';
import FormCreate from '@/components//forms/create';
import ListRecord from '@/components//records/list';
// import ListProcess from '@/components//processes/list';
import readForm from '@/components//forms/read';
import DashboardDesigner from '@/components//dashboards/designer';
import DashboardRead from '@/components//dashboards/read';
import ChartDesigner from '@/components//charts/designer';
import PointDesigner from '@/components//points/designer';
import ChartRead from '@/components//charts/read';
import ReadPie from '@/components//charts/read-pie';
import ReadBar from '@/components//charts/read-bar';
import ReadLine from '@/components//charts/read-line';
import PointRead from '@/components//points/read';
import Lists from '@/components/lists/list';
import ListDesigner from '@/components//lists/designer';
import ListRead from '@/components//lists/read';
import Tabs from '@/components/tabs/list';
import TabDesigner from '@/components//tabs/designer';
import TabRead from '@/components//tabs/read';
import Buttons from '@/components/buttons/list';
import ButtonDesigner from '@/components//buttons/designer';
import ButtonRead from '@/components//buttons/read';
import Actions from '@/components//actions/list';
import ActionDesigner from '@/components//actions/designer';
import updateActionDesign from '@/components//actions/designer-update';
import ActionRead from '@/components//actions/read';
import Processes from '@/components/processes/list';
import ProcessDesigner from '@/components//processes/designer';
import Events from '@/components/events/list';
import EventDesigner from '@/components//events/designer';
import StudioRead from '@/components//studio/read';

// import store from '../store';

Vue.use(Router);
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/home',
      name: 'Home',
      component: Home,
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/sign_in',
      name: 'SignIn',
      component: SignIn,
    },
    {
      path: '/sign_in_again',
      name: 'SignInAgain',
      component: SignInAgain,
    },
    {
      path: '/signed_in',
      name: 'SignedIn',
      component: SignedIn,
    },
    {
      path: '/sign_up',
      name: 'SignUp',
      component: SignUp,
      // beforeEnter(to , from, next) {
      //   if (store.state.idToken){
      //     next('/sign_up')
      //   }else {
      //     next('/sign_in')
      //   }
      // }
    },
    {
      path: '/log_out',
      name: 'LogOut',
      component: LogOut,
      // beforeEnter(to , from, next) {
      //   if (store.state.idToken){
      //     next('/sign_up')
      //   }else {
      //     next('/sign_in')
      //   }
      // }
    },
    {
      path: '/company',
      name: 'Company',
      component: Company,
    },
    {
      path: '/contact_us',
      name: 'ContactUs',
      component: ContactUs,
    },
    {
      path: 'Users/privacy_policy',
      name: 'PrivacyPolicy',
      component: PrivacyPolicy,
    },
    {
      path: 'Users/terms',
      name: 'Terms',
      component: Terms,
    },
    {
      path: '/services',
      name: 'Services',
      component: Services,
    },
    {
      path: '/home/recent_changes',
      name: 'RecentChanges',
      component: RecentChanges,
    },
    {
      path: '/home/best_refund',
      name: 'BestRefund',
      component: BestRefund,
    },
    {
      path: '/home/tax_tips',
      name: 'TaxTips',
      component: TaxTips,
    },
    {
      path: '/home/free_efile',
      name: 'FreeEFile',
      component: FreeEFile,
    },
    {
      path: '/home/instant_cash',
      name: 'InstantCash',
      component: InstantCash,
    },
    {
      path: '/users/files_uploaded',
      name: 'FilesUploaded',
      component: FilesUploaded,
    },
    {
      path: '/users/book_appointment',
      name: 'BookAppointment',
      component: BookAppointment,
    },
    {
      path: '/users/payments',
      name: 'UserPayments',
      component: UserPayments,
    },
    {
      path: '/users/my_appointments',
      name: 'MyAppointments',
      component: MyAppointments,
    },
    {
      path: '/Users/user_profile',
      name: 'UserProfile',
      component: UserProfile,
    },
    {
      path: '/admins/admin_panel',
      name: 'AdminPanel',
      component: AdminPanel,
    },
    {
      path: '/admins/view_all_documents',
      name: 'ViewAllDocuments',
      component: ViewAllDocuments,
    },
    {
      path: '/admins/view_all_appointments',
      name: 'ViewAllAppointments',
      component: ViewAllAppointments,
    },
    {
      path: '/admins/add_appointments',
      name: 'AddAppointments',
      component: AddAppointments,
    },
    {
      path: '/admins/payments',
      name: 'AdminPayments',
      component: AdminPayments,
    },
    {
      path: '/admins/user_approval_requests',
      name: 'UserApprovalRequests',
      component: UserApprovalRequests,
    },
    {
      path: '/admins/view_all_users',
      name: 'ViewAllUsers',
      component: ViewAllUsers,
    },
    {
      path: '/objects/list',
      name: 'ObjectList',
      component: ObjectList,
    },
    {
      path: '/forms/list',
      name: 'Forms',
      component: Forms,
    },
    {
      path: '/lists/list',
      name: 'Lists',
      component: Lists,
    },
    {
      path: '/dashboards/list',
      name: 'Dashboards',
      component: Dashboards,
    },
    {
      path: '/workflows/list',
      name: 'Workflows',
      component: Workflows,
    },
    {
      path: '/workflows/designer',
      name: 'WorkflowDesigner',
      component: WorkflowDesigner,
      props: true,
    },
    {
      path: '/requests/list',
      name: 'Requests',
      component: Requests,
    },
    {
      path: '/requests/designer',
      name: 'RequestDesigner',
      component: RequestDesigner,
      props: true,
    },
    {
      path: '/filters/list',
      name: 'Filters',
      component: Filters,
    },
    {
      path: '/filters/designer',
      name: 'FilterDesigner',
      component: FilterDesigner,
      props: true,
    },
    {
      path: '/charts/list',
      name: 'Charts',
      component: Charts,
    },
    {
      path: '/points/list',
      name: 'Points',
      component: Points,
    },
    {
      path: '/Users/list',
      name: 'Users',
      component: Users,
    },
    {
      path: '/objects/object',
      name: 'Object',
      component: Object,
      props: true,
    },
    {
      path: '/Users/user-group-update',
      name: 'UpdateUserGroup',
      component: UpdateUserGroup,
      props: true,
    },
    {
      path: '/forms/designer',
      name: 'FormDesigner',
      component: FormDesigner,
      props: true,
    },
    {
      path: '/charts/designer',
      name: 'ChartDesigner',
      component: ChartDesigner,
      props: true,

    },
    {
      path: '/points/designer',
      name: 'PointDesigner',
      component: PointDesigner,
      props: true,

    },
    {
      path: '/lists/designer',
      name: 'ListDesigner',
      component: ListDesigner,
      props: true,
    },
    // {
    //   path: '/processes/designer',
    //   name: 'ProcessDesigner',
    //   component: ProcessDesigner,
    //
    // },
    {
      path: '/dashboards/designer',
      name: 'DashboardDesigner',
      component: DashboardDesigner,
      props: true,
    },
    {
      path: '/dashboards/read/:name',
      name: 'DashboardRead',
      component: DashboardRead,
      props: true,
      // children: [{
      //   path: 'tabs/:name',
      //   component: DashboardRead,
      // }],
    },
    {
      path: '/forms/create',
      name: 'FormCreate',
      component: FormCreate,

    },
    {
      path: '/records/list',
      name: 'ListRecord',
      component: ListRecord,
      props: true,
    },
    {
      path: '/forms/read',
      name: 'readForm',
      component: readForm,
      props: true,
    },
    {
      path: '/lists/read',
      name: 'ListRead',
      component: ListRead,
      props: true,
    },
    {
      path: '/charts/read',
      name: 'ChartRead',
      component: ChartRead,
      props: true,
    },
    {
      path: '/charts/read-pie',
      name: 'ReadPie',
      component: ReadPie,
      props: true,
    },
    {
      path: '/charts/read-bar',
      name: 'ReadBar',
      component: ReadBar,
      props: true,
    },
    {
      path: '/charts/read-line',
      name: 'ReadLine',
      component: ReadLine,
      props: true,
    },
    {
      path: '/points/read',
      name: 'PointRead',
      component: PointRead,
      props: true,
    },
    {
      path: '/Users/user-group-create',
      name: 'CreateUserGroup',
      component: CreateUserGroup,
    },
    {
      path: '/tabs/list',
      name: 'Tabs',
      component: Tabs,
    },
    {
      path: '/tabs/designer',
      name: 'TabDesigner',
      component: TabDesigner,
      props: true,
    },
    {
      path: '/tabs/read',
      name: 'TabRead',
      component: TabRead,
      props: true,
    },
    {
      path: '/buttons/list',
      name: 'Buttons',
      component: Buttons,
      props: true,
    },
    {
      path: '/buttons/designer',
      name: 'ButtonDesigner',
      component: ButtonDesigner,
      props: true,
    },
    {
      path: '/buttons/read',
      name: 'ButtonRead',
      component: ButtonRead,
      props: true,
    },
    {
      path: '/actions/list',
      name: 'Actions',
      component: Actions,
    },
    {
      path: '/actions/designer',
      name: 'ActionDesigner',
      component: ActionDesigner,

    },
    {
      path: '/actions/read',
      name: 'ActionRead',
      component: ActionRead,
      props: true,
    },
    {
      path: '/studio/read',
      name: 'StudioRead',
      component: StudioRead,
      props: true,
    },
    {
      path: '/actions/designer-update',
      name: 'updateActionDesign',
      component: updateActionDesign,
      props: true,
    },
    {
      path: '/processes/list',
      name: 'Processes',
      component: Processes,
    },
    {
      path: '/processes/designer',
      name: 'ProcessDesigner',
      component: ProcessDesigner,
      props: true,
    },
    {
      path: '/events/designer',
      name: 'EventDesigner',
      component: EventDesigner,
      props: true,
    },
    {
      path: '/events/list',
      name: 'Events',
      component: Events,
      props: true,
    },
    {
      path: '/studio/studio',
      name: 'Studio',
      component: Studio,
      props: true,
    },
    {
      path: '/studio/list',
      name: 'Studios',
      component: Studios,
      props: true,
    },

  ],
});
