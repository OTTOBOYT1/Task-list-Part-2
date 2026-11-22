
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ref,
  push,
  set,
  update,
  remove,
  onValue,
  Unsubscribe
} from 'firebase/database';
import { database } from './firebase.config';

interface Note {
  id: string;
  title: string;
  text: string;
}

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  title = '';
  text = '';
  notes: Note[] = [];
  editingId: string | null = null;
  saving = false;

  private unsubscribe?: Unsubscribe;

  ngOnInit(): void {
    if (typeof window === 'undefined') return;

    const notesRef = ref(database, 'notes');

    this.unsubscribe = onValue(notesRef, snapshot => {
      const data = snapshot.val();

      this.notes = data
        ? Object.entries(data).map(([id, value]) => {
            const note = value as { title: string; text: string };

            return {
              id,
              title: note.title,
              text: note.text
            };
          })
        : [];
    }, error => {
      console.error('Firebase error:', error);
    });
  }

  async addNote(): Promise<void> {
    if (!this.title.trim() || !this.text.trim()) return;

    if (this.saving) return;
    this.saving = true;
    try {
      if (this.editingId !== null) {
        await update(ref(database, `notes/${this.editingId}`), {
          title: this.title.trim(),
          text: this.text.trim()
        });
      } else {
        const newNoteRef = push(ref(database, 'notes'));

        await set(newNoteRef, {
          title: this.title.trim(),
          text: this.text.trim()
        });
      }

      this.cancelEdit();
    } catch (error) {
      console.error('Failed to save note:', error);
      alert('Could not save note. Check Firebase permissions and connection.');
    } finally {
      this.saving = false;
    }
  }

  editNote(note: Note): void {
    this.editingId = note.id;
    this.title = note.title;
    this.text = note.text;
  }

  cancelEdit(): void {
    this.editingId = null;
    this.title = '';
    this.text = '';
  }

  async deleteNote(id: string): Promise<void> {
    try {
      await remove(ref(database, `notes/${id}`));

      if (this.editingId === id) {
        this.cancelEdit();
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
      alert('Could not delete note. Check Firebase permissions and connection.');
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe?.();
  }
}
