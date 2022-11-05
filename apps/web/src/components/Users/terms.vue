<template>
  <div class="grey lighten-4">
    <v-container style="margin-bottom: 40px;">
      <v-layout>
        <v-flex>
          <v-card>
            <div class="pt-5 mr-5 pr-5 ml-5 pl-5">
              <div class="display-2 pb-5 red--text">Terms & Conditions</div>
              <div class="subheading pb-4 ">
                These Covenants are governed by the laws of Ontario.
              </div>
              <div class="subheading pb-4 ">
                You are accepting these terms and conditions for accessing
                this website to avail the services of Tax Dollar inc.
                a company incorporated in Canada to provide tax preparation
                and tax filing services. If you do not agree to these
                terms and conditions including any future amendments
                do not access this website for any of the products or
                services made available here.
              </div>
              <div class="subheading pb-4 ">
                You and your family member will provide all the necessary
                information for the purposes of preparation and filing
                income tax return with CRA.
              </div>
              <div class="subheading pb-4 ">
                Your family members (spouse and children) have authorized you to
                discuss & provide financial and tax affairs for
                the purposes for tax preparation and filing.
              </div>
              <div class="subheading pb-4 ">
                You will be responsible for protecting the password or other information
                which enables you to access your personal / confidential records on this
                website.
              </div>
              <div class="subheading pb-4 ">
                Tax Dollar Website, its contents, names, texts, and images included on
                them are provided “As Is’’ basis. No representation or satisfactory
                quality or fitness for particular purpose whether express or implied
                is given that the information and materials contained on such website
                or websites s are free from errors or inaccuracy.
              </div>
              <div class="subheading pb-4 ">
                Our websites contain guidance and notes on certain aspects of
                law as they might affect the average person. They are intended
                only as a broad guideline and are by no means definitive. The law
                is constantly changing so expert advice should always be sought.
              </div>
              <div class="subheading pb-4 ">
                To the extent permitted by applicable laws, no liability is
                accepted for any direct, indirect or consequential loss or damage
                however resulting from the access to and use of Tax Dollar
                website or other related websites and the information and
                materials contained on them.
              </div>
              <div class="subheading pb-4 ">
                Links contained in Tax Dollar websites may lead to websites
                not under the control of Tax Dollar and Tax Dollar is not
                responsible for the contents of any linked site or any link
                contained in a linked site. Links provided on Tax Dollar website
                are provided to users only as a convenience and the inclusion of
                any link does not imply endorsement by Tax Dollar of, and
                Tax Dollar accepts no liability in respect of the content of,
                any such linked site. Users link to any linked sites at their own risk.
              </div>
              <div class="subheading pb-4 ">
                System performance or due to other technical issues and non-availability
                of internet may affect your access to this website for which TAX Dollar
                does not provide any express or implied warranty.
              </div>
              <div class="subheading pb-4 ">
                TAX Dollar reserves the right to make any changes in its website
                anytime without notice or reason and shall not be liable to you
                or third parties for discontinuance, suspension or other changes
                in any part or whole of the website.
              </div>
              <div class="subheading pb-4 ">
                You are obliged to provide correct information and other related
                supporting documents to TAX Dollar while registering with the
                website and during the time of use of this website. TAX Dollar
                reserves the right to terminate the access the website or services
                for providing stale, inaccurate, incomplete, or wrong information in
                any manner without any limitation and deny future use of it.
              </div>
              <div class="subheading pb-4 ">
                Your personal information collected by TAX Dollar via this Site is subject
                to TAX Dollar’s Privacy Policy. For more information,
                please review Tax Dollar’s
                <a href="javascript:void(0)" @click="privacyPolicy">Privacy Policy.</a>
              </div>
              <div class="subheading pb-4 ">
                TAX Dollar is not obliged to your commitments to third parties in
                relations to any agreements, payment, delivery of service,
                their timeliness or otherwise. These will be determined based
                on solely based on the conditions agreed between you or third
                parties whether they relate to promotion, advertising or otherwise.
              </div>
              <div class="subheading pb-4 ">
                Tax Dollar in no event shall be liable to you or third party for
                information transmitted through website without any limitation for
                any claims or damages.
              </div>
              <div class="subheading pb-4 " style="CenterAlign:true">
                You agree to indemnify TAX Dollar and its associates and hold
                them harmless any liability arising from use of this website.
              </div>
            </div>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>


<script>
export default {
  methods: {
    privacyPolicy() {
      this.$router.push('/privacy_policy');
    },
  },
};
</script>
