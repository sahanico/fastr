<template>
  <div v-if="$route.matched[0].meta.breadcrumb" style="padding-left: 16px;">
    <router-link v-for="(crumb, i) in previousBreadcrumbs" :key="i" :to="crumb.path"
                 @click.native.prevent="goBack(i + 1)">
        {{
          i < (breadcrumbLength - 1)
            ? i === 0
              ? crumb.name
              : ` / ${crumb.name}`
            : ''
        }}
    </router-link>
    {{
      breadcrumbLength === 1
        ? `${previousBreadcrumbs[previousBreadcrumbs.length - 1].name}`
        : ` / ${previousBreadcrumbs[previousBreadcrumbs.length - 1].name}`
    }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      previousBreadcrumbs: [],
      crumbListMap: {
        user_account_members_screen: 'Manage Members',
        user_invoices_screen: 'Invoices',
        admin_invoices_screen: 'Invoices',
        payments_screen: 'Payments',
        admin_accounts_screen: 'Accounts',
        admin_users_screen: 'Users',
        metrics: 'Metrics',
        admin_approval_requests: 'Approval Requests',
        all_documents_dashboard: 'All Documents',
      },
    };
  },
  computed: {
    breadcrumbLength() {
      return this.previousBreadcrumbs.length;
    },
  },
  methods: {
    goBack(leg) {
      const legsToRemove = this.breadcrumbLength - leg;
      const currentLegs = JSON.parse(JSON.stringify(this.previousBreadcrumbs));
      // eslint-disable-next-line no-plusplus
      for (let i = legsToRemove + 1; i > 0; i--) {
        this.previousBreadcrumbs.pop();
      }
      this.$router.push(currentLegs[currentLegs.length - (legsToRemove + 1)].path);
    },
  },
  watch: {
    $route: {
      async handler(val) {
        if (val.matched[0].meta.breadcrumb) {
          if (val.matched[0].meta.breadcrumb === 'List') {
            this.previousBreadcrumbs = [{
              name: this.crumbListMap[val.params.designName],
              path: val.fullPath,
            }];
          } else if (val.matched[0].meta.breadcrumb === 'List with input') {
            // resolve name from input id:
            const record = await this.$store.dispatch('getRecordByObjectID', {
              id: val.params.inputId,
            });
            let name = `${record.data.first_name} ${record.data.last_name}`;
            if (val.params.designName === 'admin_account_members_screen') {
              name = `${record.data.name}`;
            } else if (val.params.designName === 'update_invoice_screen') {
              name = `Update Invoice - ${record.data.bill_to_name}`;
            }
            this.previousBreadcrumbs.push({
              name,
              path: val.fullPath,
            });
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>
