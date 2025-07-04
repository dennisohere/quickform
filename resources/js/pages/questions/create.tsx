import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';

interface Survey {
  id: string;
  title: string;
}

interface Props {
  survey: Survey;
}

export default function QuestionCreate({ survey }: Props) {
  const [options, setOptions] = useState<string[]>(['']);
  const [questionType, setQuestionType] = useState<string>('text');

  const { data, setData, post, processing, errors } = useForm({
    question_text: '',
    question_type: 'text',
    options: [] as string[],
    is_required: false as boolean,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty options
    const filteredOptions = questionType === 'text' || questionType === 'textarea' || questionType === 'number' || questionType === 'email' || questionType === 'date' 
      ? [] 
      : options.filter(option => option.trim() !== '');
    
    setData('options', filteredOptions);
    post(route('surveys.questions.store', survey.id));
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const needsOptions = ['radio', 'checkbox', 'select'].includes(questionType);

  return (
    <>
      <Head title="Add Question" />
      
      <div className="container mx-auto py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Add Question</h1>
          <p className="text-muted-foreground mt-2">
            Add a new question to "{survey.title}"
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Question Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="question_text">Question Text *</Label>
                <Input
                  id="question_text"
                  type="text"
                  value={data.question_text}
                  onChange={(e) => setData('question_text', e.target.value)}
                  placeholder="Enter your question"
                  className="mt-1"
                />
                {errors.question_text && (
                  <p className="text-sm text-destructive mt-1">{errors.question_text}</p>
                )}
              </div>

              <div>
                <Label htmlFor="question_type">Question Type *</Label>
                <Select
                  value={questionType}
                  onValueChange={(value) => {
                    setQuestionType(value);
                    setData('question_type', value);
                    if (!['radio', 'checkbox', 'select'].includes(value)) {
                      setOptions(['']);
                    }
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select question type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Short Text</SelectItem>
                    <SelectItem value="textarea">Long Text</SelectItem>
                    <SelectItem value="radio">Multiple Choice (Single Answer)</SelectItem>
                    <SelectItem value="checkbox">Multiple Choice (Multiple Answers)</SelectItem>
                    <SelectItem value="select">Dropdown</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                  </SelectContent>
                </Select>
                {errors.question_type && (
                  <p className="text-sm text-destructive mt-1">{errors.question_type}</p>
                )}
              </div>

              {needsOptions && (
                <div>
                  <Label>Options *</Label>
                  <div className="space-y-2 mt-1">
                    {options.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                        />
                        {options.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeOption(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addOption}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Option
                    </Button>
                  </div>
                  {errors.options && (
                    <p className="text-sm text-destructive mt-1">{errors.options}</p>
                  )}
                </div>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_required"
                  checked={data.is_required}
                  onChange={(e) => setData('is_required', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="is_required">This question is required</Label>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={processing}>
                  {processing ? 'Adding...' : 'Add Question'}
                </Button>
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
} 