import { diagnoser_molang_syntax } from '../../../../src/Lib/Diagnostics/Molang';
import { TestDiagnoser } from '../../../diagnoser';

interface TestCase {
  name: string
  data: any
}

describe("Molang Syntax",()=>{
  const no_errors_tests: TestCase[] = [
    {
      name: "Command with selector",
      data: {
        on_entry: [
          "/event entity @e[type=foo:bar] foo:update"
        ]
      }
    },
    {
      name: "Transition with comparison",
      data: {
        transition: [
          { "foo": "q.property('foo:bar')==0&&q.all_animations_finished" }
        ]
      }
    },
    {
      name: "Comparison should not be confused with assignment",
      data: {
        transition: [
          "q.property('foo:bar')==0&&q.all_animations_finished",
          "variable.example<=1;",
          "variable.example>=1;",
          "variable.example!=1;",
          "variable.example <= 1;",
          "variable.example >= 1;",
          "variable.example != 1;",
          "q.property('foo:bar')==0&&q.all_animations_finished",
        ]
      }
    },
    {
      name: "Some complex",
      data: "v.temp_outfit!=q.property('foo:bar')+q.property('foo:bar')+q.property('foo:bar')"
    }
  ]

  const errors_tests: TestCase[] = [
    {
      name: "Assignment without semicolon",
      data: {
        transition: [
          "variable.example=1"
        ]
      }
    },
    {
      name: "Double Expression",
      data: {
        transition: [
          "variable.example=1;variable.example=1"
        ]
      }
    },
    {
      name: "Should trigger",
      data: "variable.something = 1.0"
    }
  ];

  for (const test of no_errors_tests) {
    it(`no errors test: ${test.name}`, () => {
      const diagnoser = new TestDiagnoser();
      diagnoser_molang_syntax(test.data, diagnoser);

      diagnoser.expectEmpty();
    });
  }

  for (const test of errors_tests) {
    it(`errors test: ${test.name}`, () => {
      const diagnoser = new TestDiagnoser();
      diagnoser_molang_syntax(test.data, diagnoser);

      diagnoser.expectAny();
    });
  }
});