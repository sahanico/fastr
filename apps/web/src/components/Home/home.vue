<template>
  <div class="grey lighten-4">
    <v-container>
      <v-layout>
        <v-flex>
          <v-carousel height="450" @click.native="click">
            <v-carousel-item
              v-for="carouselItem in carouselItems"
              :key="carouselItem.id"
              :src="carouselItem.imageUrl">
              <div>
                <div class="title">
                  <p>{{ carouselItem.title }}</p>
                  <p>{{ carouselItem.description }}
                  </p>
                </div>
              </div>
            </v-carousel-item>
          </v-carousel>
        </v-flex>
      </v-layout>
    </v-container>
    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex lg10 offset-lg1 xs12>
            <v-card flat>
              <div class="headline pt-5 pb-4 red--text">Recent changes to Canadian tax laws</div>

              <div class="subheading pr-3 pl-3 pb-2 red--text ">Amounts received related to COVID-19
              </div>
              <div>
                <p class="body-2 pr-3 pl-4 pb-2  ">
                  During the year, you may have received federal, provincial, or territorial
                  government COVID-19 payments such as the Canada Emergency Response Benefit (CERB).
                  If these amounts are taxable, you will have received a slip, such as a T4A or T4E,
                  with instructions for how to report these amounts. These slips also are available
                  in
                  <a
                    href="https://www.canada.ca/en/revenue-agency/services/e-services/e-services-individuals/account-individuals.html">My
                    Account</a>.
                </p>
                <p class="body-2 pr-3 pl-4 pb-2  ">
                  If you are self-employed, you may have received federal, provincial, or
                  territorial government COVID-19 assistance for your business, such as the Canada
                  Emergency Wage Subsidy (CEWS). Generally, you have to either include these amounts
                  in business income or reduce your expenses by the amounts that you received. You
                  may also have received a government loan. The loan itself is not taxable, but you
                  have to include in your business income any portion of the loan that is
                  forgivable.
                </p>
                <p class="body-2 pr-3 pl-4 pb-2  ">
                  Even if you received an information slip showing taxable income, if you received
                  any part of these amounts based on income that is exempt from tax under the Indian
                  Act, complete
                  <a
                    href="https://www.canada.ca/en/revenue-agency/services/forms-publications/forms/t90.html">
                    Form T90, Income Exempt From Tax Under the Indian Act.</a>
                </p>
                <p class="body-2 pr-3 pl-4 pb-2  ">
                  If you received the Canada Recovery Benefit (CRB), you may have to repay all or
                  part of it, if your net income after certain adjustments is more than $38,000. The
                  repayment is calculated on the Worksheet for the return at <a
                  href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/line-23500-social-benefits-repayment.html">
                  line 23500</a>, as part of
                  the social benefits repayment calculation.
                </p>
                <p class="body-2 pr-3 pl-4 pb-2  ">
                  For details: <a
                  href="https://www.canada.ca/en/services/taxes/income-tax/personal-income-tax/covid19-taxes.html">
                  COVID-19 benefits and your taxes</a>
                </p>
              </div>

              <div class="subheading pr-3 pl-3 pb-2 red--text ">Home office expenses for employees
              </div>
              <div class="body-2 pr-3 pl-4 pb-2  ">
                As an employee, you may be able to claim certain home office expenses
                (work-space-in-the-home expenses, office supplies, and certain phone expenses).
              </div>
              <div class="body-2 pr-3 pl-4 pb-2  ">
                This deduction is claimed on your personal income tax return. Deductions reduce the
                amount of income you pay tax on, so they reduce your overall income tax liability.
              </div>
              <div class="body-2 pr-3 pl-4 pb-2  ">
                <p>
                  <a
                    href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/line-229-other-employment-expenses/work-space-home-expenses/what-changes.html">
                    What the changes are</a>
                  -
                   Latest changes to claiming the deduction
                </p>
                <p>
                  <a
                    href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/line-229-other-employment-expenses/work-space-home-expenses/compare-methods.html">
                    Compare the claim methods</a>
                  -
                   Claim a temporary flat rate of $2 per day or claim the actual amounts you paid
                </p>
                <p>
                  <a
                    href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/line-229-other-employment-expenses/work-space-home-expenses/who-claim.html">
                    Who can claim</a>
                  -
                   Who is eligible to claim expenses for a work space in the home
                </p>
                <p>
                  <a
                    href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/line-229-other-employment-expenses/work-space-home-expenses/work-space-use.html">
                    Determine your work space use</a>
                  -
                   Space in the home, shared spaces, and hours worked
                </p>
                <p>
                  <a
                    href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/line-229-other-employment-expenses/work-space-home-expenses/expenses-can-claim.html">
                    Expenses you can claim</a>
                  -
                   Expenses that can and cannot be claimed, and expense limitations
                </p>
                <p>
                  <a
                    href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/line-229-other-employment-expenses/work-space-home-expenses/calculate-expenses.html">
                    Calculate your expenses</a>
                  -
                   Use a calculator to determine the claim amounts and percentage of use
                </p>
                <p>
                  <a
                    href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/line-229-other-employment-expenses/work-space-home-expenses/how-claim.html">
                    How to claim</a>
                  -
                   When and how to claim expenses
                </p>
                <p>
                  <a
                    href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/line-229-other-employment-expenses/work-space-home-expenses/frequently-asked-questions.html">
                    Frequently asked questions</a>
                </p>
              </div>

              <div class="subheading pr-3 pl-3 pb-2 red--text ">Canada Pension Plan</div>
              <div class="body-2 pr-3 pl-4 pb-2  ">
                - Contributions are up from 4.95 % to 5.1 % on earnings between
                $3,500 and $47,400.
              </div>
              <div class="body-2 pr-3 pl-4 pb-2  ">
                - The rate will gradually increase to 5.95 % by 2023
              </div>

              <div class="subheading pr-3 pl-3 pb-2 red--text">Employment Insurance Premiums</div>
              <div class="body-2 pr-3 pl-4 pb-3">
                - Premiums are reduced from $1.66 to $1.62 per $100 of insurable
                earnings.
              </div>

              <div class="subheading pr-3 pl-3 pb-2 red--text">Canada Workers Benefit</div>
              <div class="body-2 pr-3 pl-4 pb-3">
                - Canadians can recieve a maximum Benefit of $1,355 for a single person
                and $2,335 for a single parent or couple subject to your personal income.
              </div>

              <div class="subheading pr-3 pl-3 pb-2 red--text">Small Business Tax</div>
              <div class="body-2 pr-3 pl-4 pb-3">- Reduced from 10 % to 9% from 2019.</div>
              <div class="body-2 pr-3 pl-4 pb-3">
                - Higher tax rate for Passive Income (e.g. Investment Income).
              </div>

              <div class="subheading pr-3 pl-3 pb-2 red--text">Basic Personal Amount</div>
              <div class="body-2 pr-3 pl-4 pb-3 ">
                - The basic personal amount rises from $11,809 to $12,069.
              </div>


              <div class="subheading pr-3 pl-3 pb-2 red--text">Tax Free Saving Account</div>
              <div class="body-2 pr-3 pl-4 pb-3  ">
                - The annual contribution limit to tax-free savings accounts will
                increase from $5,500 to $6,000.
              </div>

            </v-card>
          </v-flex>


        </v-layout>
      </v-container>
    </v-card>
    <v-container>
      <v-layout row wrap>
        <v-flex lg10 offset-lg1 xs12>
          <v-card class="grey lighten-4" flat>
            <div class="headline pt-5 pb-4 red--text">Free E-FILE</div>
            <div class="body-2 pr-3 pl-3 pt-3 pb-3  ">
              Our tax preparation fee includes free E-FILE. With certain
              exceptions, we can file your return electronically to the CRA.
            </div>
            <div class="body-2 pr-3 pl-4 pb-2 ">
              - Quick refund (Less than two weeks in most cases)
            </div>
            <div class="body-2 pr-3 pl-4 pb-2 ">- More accuracy</div>
            <div class="body-2 pr-3 pl-4 pb-2 ">- Immediate confirmation</div>
            <div class="body-2 pr-3 pl-4 pb-5 ">- Faster processing</div>
          </v-card>
        </v-flex>


      </v-layout>
    </v-container>


    <v-card class="mb-5">
      <v-container>
        <v-layout row wrap>


          <v-flex lg10 offset-lg1 xs12>
            <v-card flat>
              <div class="headline pt-5 pb-4 red--text">Tax Tips</div>
              <div class="body-2 pr-3 pl-4 pb-2 ">
                - In most cases the lower income spouse should claim medical
                expenses
              </div>
              <div class="body-2 pr-3 pl-4 pb-2 ">
                - Instead of claiming the donation every year it is better to claim
                donations in bulks of five years.
              </div>
              <div class="body-2 pr-3 pl-4 pb-2 ">
                - Union dues paid to trade union outside Canada might also be tax
                deductible
              </div>
              <div class="body-2 pr-3 pl-4 pb-2 ">
                - If the total expenses of commissioned employees exceeds the
                commission income, there may be alternative methods of claiming all the expenses
              </div>
              <div class="body-2 pr-3 pl-4 pb-5 ">
                - If you are a commissioned employee, consider leasing rather than
                purchasing certain capital equipment like computers
              </div>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </div>


</template>

<script>

export default {
  title: 'Factor-e',
  data() {
    return {
      carouselItems: [
        {
          link: '/home/recent_changes',
          imageUrl: 'https://images.unsplash.com/photo-1531938273339-caac37a7f620?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1489&q=80',
          id: 'afasadsa',
          title: 'Recent Changes',
          description: 'Every year many changes are made in income tax rules. Make sure that your Income-tax Return is prepared by a qualified and experienced professional.',
        },
        {
          link: '/home/best_refund',
          imageUrl: 'https://images.unsplash.com/photo-1534322869500-14fc9f5f5767?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
          id: 'afa32sadsa',
          title: 'Best REFUND Guaranteed',
          description: 'Our employees are professional and experienced. Our mission is your satisfaction and we guarantee the best refund.',
        },
        {
          link: '/home/tax_tips',
          imageUrl: 'https://images.unsplash.com/photo-1523629619140-ee5b56cb3b23?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1474&q=80',
          id: 'afasad213sa',
          title: 'Tax Tips',
          description: 'Are you sure that you are claiming all the credits and deductions you are entitled to? Are all credits and deductions you claim to your advantages? Not sure? call the professional!',
        },
        {
          link: '/home/free_efile',
          imageUrl: 'https://images.unsplash.com/photo-1520405705492-78c3b6cb1a48?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1461&q=80',
          id: 'afasa13222dsa',
          title: 'Free E-FILE',
          description: 'TAX Dollar is a registered tax professional of CRA and is authorised electronic filing (E-FILE) of tax returns. Our tax preparation fee includes free E-FILE.',
        },
      ],
    };
  },
  methods: {},
};
</script>

<style>
.title {
  position: absolute;
  bottom: 50px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 3em;
  padding: 20px;
  text-align: center;
}

.phoneNumber {
  width: 100%;
  color: red;
  font-size: 1.5em;
  margin-left: auto;
  margin-right: auto;
  display: block;
  text-align: center;
}

.taxDollarLogo {
  margin-top: 20px;
  padding-left: 10px;
  width: 30%;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>

