import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import SurveyFormModal from '@/components/survey-form-modal';

interface Survey {
  id: string;
  title: string;
  description: string | null;
}

interface Props {
  survey: Survey;
}

export default function SurveyEdit({ survey }: Props) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(true);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
    },
    {
      title: 'Surveys',
      href: '/surveys',
    },
    {
      title: survey.title,
      href: `/surveys/${survey.id}`,
    },
    {
      title: 'Edit Survey',
      href: `/surveys/${survey.id}/edit`,
    },
  ];

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    // Redirect back to surveys list
    router.visit('/surveys');
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit ${survey.title}`} />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Edit Survey</h1>
          <p className="text-base-content/70 mt-2">
            Update the details of your survey.
          </p>
        </div>

        {/* Edit Survey Modal */}
        <SurveyFormModal
          survey={survey}
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          mode="edit"
        />
      </div>
    </AppLayout>
  );
}
